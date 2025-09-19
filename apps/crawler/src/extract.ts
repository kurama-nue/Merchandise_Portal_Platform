import { load } from 'cheerio';
import { politeFetch } from './politeFetch.js';
import crypto from 'node:crypto';
import { v4 as uuidv4 } from 'uuid';
import { writeFileSync } from 'node:fs';

export async function fetchAndExtractProduct(url: URL) {
  const res = await politeFetch(url.toString());
  if (!res.ok) return null;
  const html = await res.text();
  const $ = load(html);

  // Attempt to find JSON-LD
  const jsonLd: any[] = [];
  $('script[type="application/ld+json"]').each((_: any, el: any) => {
    try {
      const txt = $(el).contents().text();
      const obj = JSON.parse(txt);
      if (Array.isArray(obj)) jsonLd.push(...obj); else jsonLd.push(obj);
    } catch {}
  });

  // Try JSON-LD Product schema first
  const productLd = jsonLd.find((j: any) => j['@type'] === 'Product' || (Array.isArray(j['@type']) && j['@type'].includes('Product')));

  // Basic extraction with fallbacks
  const title = (productLd?.name as string) || $('h1').first().text().trim() || $('meta[property="og:title"]').attr('content') || '';
  const offer = productLd?.offers && (Array.isArray(productLd.offers) ? productLd.offers[0] : productLd.offers);
  const priceMeta = offer?.price || $('meta[itemprop="price"]').attr('content') || $('meta[property="product:price:amount"]').attr('content') || '';
  const price = Number(String(priceMeta).replace(/[^0-9.]/g, '')) || 0;
  const currency = offer?.priceCurrency || $('meta[itemprop="priceCurrency"]').attr('content') || $('meta[property="product:price:currency"]').attr('content') || 'INR';

  const imageSet = new Set<string>();
  const ldImages: string[] = productLd?.image ? (Array.isArray(productLd.image) ? productLd.image : [productLd.image]) : [];
  ldImages.forEach((u) => { if (typeof u === 'string') imageSet.add(u); });
  $('img').each((_: any, el: any) => {
    const src = $(el).attr('src') || $(el).attr('data-src');
    if (src && /^https?:\/\//.test(src)) imageSet.add(src);
  });

  const descriptionText = (productLd?.description as string) || $('meta[name="description"]').attr('content') || $('p').slice(0, 3).text();
  const description_short = descriptionText.split(/\s+/).slice(0, 25).join(' ');

  const product_id = uuidv4();
  const now = new Date().toISOString();

  const categories: string[] = [];
  $('nav a, .breadcrumb a').each((_: any, el: any) => {
    const t = $(el).text().trim();
    if (t && !/home/i.test(t)) categories.push(t);
  });
  if (Array.isArray(productLd?.category)) categories.push(...productLd.category);

  let ratings: number | null = null;
  let reviews_count: number | null = null;
  if (productLd?.aggregateRating) {
    ratings = Number(productLd.aggregateRating.ratingValue) || null;
    reviews_count = Number(productLd.aggregateRating.reviewCount) || null;
  }

  const variants: any[] = [];
  // Attempt to parse variants from JSON-LD (often not present) or data attributes
  // Placeholder: size options
  const sizeOptions = new Set<string>();
  $('[name*="size"], .size, .size-selector button, .size-chart .size').each((_: any, el: any) => {
    const t = $(el).text().trim();
    if (t && /^[A-Z0-9]{1,3}$/.test(t)) sizeOptions.add(t);
  });
  for (const size of Array.from(sizeOptions)) {
    variants.push({
      variant_id: uuidv4(),
      sku: '',
      attributes: { size },
      price,
      available: true,
      inventory_count: null,
      image_ids: [],
    });
  }

  const canonical = {
    product_id,
    source_site: 'thesouledstore.com',
    source_product_url: url.toString(),
    source_product_id: productLd?.sku || '',
    title,
    brand: 'The Souled Store',
    categories: Array.from(new Set(categories)).slice(0, 6),
    tags: [],
    description_short,
    description_long: null,
    price,
    currency,
    compare_at_price: null,
    is_on_sale: false,
    variants,
    images: Array.from(imageSet).slice(0, 8).map(src => ({
      image_id: uuidv4(),
      source_image_url: src,
      alt_text: null,
      licensed_for_use: 'unknown',
    })),
    ratings,
    reviews_count,
    last_synced_at: now,
    source_hash: '',
    meta: {
      snapshot: {
        length: html.length,
      },
    }
  } as any;

  // Normalize object before hashing (stable key order)
  const normalized = JSON.stringify(canonical, Object.keys(canonical).sort());
  const source_hash = crypto.createHash('sha256').update(normalized).digest('hex');
  canonical.source_hash = source_hash;

  // Optionally write a small HTML snapshot for debugging (first 10KB)
  try { writeFileSync('snapshots.txt', `\nURL: ${url.toString()}\nHASH: ${source_hash}\nTITLE: ${title}\n---\n${html.slice(0, 10000)}\n====\n`, { flag: 'a' }); } catch {}

  return canonical;
}
