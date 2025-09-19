import { Client } from 'pg';

export async function getPgClient() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL is not set. To use --upsert, create apps/crawler/.env with DATABASE_URL or set it in your environment.'
    );
  }
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  return client;
}

export async function ensureSchema(client: Client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS products (
      product_id uuid PRIMARY KEY,
      source_site text,
      source_product_id text,
      source_product_url text,
      title text,
      brand text,
      description_short text,
      description_long text,
      price numeric,
      currency varchar(8),
      compare_at_price numeric,
      is_on_sale boolean,
      ratings numeric,
      reviews_count integer,
      last_synced_at timestamptz,
      source_hash text,
      meta jsonb
    );
    CREATE TABLE IF NOT EXISTS product_variants (
      variant_id uuid PRIMARY KEY,
      product_id uuid REFERENCES products(product_id),
      sku text,
      attributes jsonb,
      price numeric,
      available boolean,
      inventory_count integer,
      image_ids uuid[]
    );
    CREATE TABLE IF NOT EXISTS product_images (
      image_id uuid PRIMARY KEY,
      product_id uuid REFERENCES products(product_id),
      source_image_url text,
      alt_text text,
      width integer,
      height integer,
      licensed_for_use varchar(50),
      cdn_url text
    );
  `);
}

export async function upsertProduct(client: Client, product: any) {
  await client.query(
    `INSERT INTO products (
      product_id, source_site, source_product_id, source_product_url, title, brand,
      description_short, description_long, price, currency, compare_at_price, is_on_sale,
      ratings, reviews_count, last_synced_at, source_hash, meta
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17
    ) ON CONFLICT (product_id) DO UPDATE SET
      title = EXCLUDED.title,
      description_short = EXCLUDED.description_short,
      price = EXCLUDED.price,
      currency = EXCLUDED.currency,
      compare_at_price = EXCLUDED.compare_at_price,
      is_on_sale = EXCLUDED.is_on_sale,
      ratings = EXCLUDED.ratings,
      reviews_count = EXCLUDED.reviews_count,
      last_synced_at = EXCLUDED.last_synced_at,
      source_hash = EXCLUDED.source_hash,
      meta = EXCLUDED.meta
    `,
    [
      product.product_id,
      product.source_site,
      product.source_product_id || null,
      product.source_product_url,
      product.title,
      product.brand || null,
      product.description_short || null,
      product.description_long || null,
      product.price || null,
      product.currency || null,
      product.compare_at_price || null,
      product.is_on_sale || false,
      product.ratings || null,
      product.reviews_count || null,
      product.last_synced_at,
      product.source_hash,
      product.meta ? JSON.stringify(product.meta) : null,
    ]
  );

  // images
  if (Array.isArray(product.images)) {
    for (const img of product.images) {
      await client.query(
        `INSERT INTO product_images (image_id, product_id, source_image_url, alt_text, width, height, licensed_for_use, cdn_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT (image_id) DO UPDATE SET source_image_url = EXCLUDED.source_image_url, alt_text = EXCLUDED.alt_text, licensed_for_use = EXCLUDED.licensed_for_use, cdn_url = EXCLUDED.cdn_url`,
        [img.image_id, product.product_id, img.source_image_url, img.alt_text || null, img.width || null, img.height || null, img.licensed_for_use || 'unknown', img.cdn_url || null]
      );
    }
  }

  // variants
  if (Array.isArray(product.variants)) {
    for (const v of product.variants) {
      await client.query(
        `INSERT INTO product_variants (variant_id, product_id, sku, attributes, price, available, inventory_count, image_ids)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT (variant_id) DO UPDATE SET sku = EXCLUDED.sku, attributes = EXCLUDED.attributes, price = EXCLUDED.price, available = EXCLUDED.available, inventory_count = EXCLUDED.inventory_count, image_ids = EXCLUDED.image_ids`,
        [
          v.variant_id,
          product.product_id,
          v.sku || null,
          v.attributes ? JSON.stringify(v.attributes) : null,
          v.price || null,
          v.available ?? null,
          v.inventory_count ?? null,
          v.image_ids || null,
        ]
      );
    }
  }
}
