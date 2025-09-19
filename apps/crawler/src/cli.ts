import 'dotenv/config';
import { URL } from 'node:url';
import { discoverUrls } from './discover.js';
import { fetchAndExtractProduct } from './extract.js';
import { isAllowed } from './robots.js';
import { ensureSchema, getPgClient, upsertProduct } from './storage.js';
import { writeFileSync } from 'node:fs';

async function main() {
  const args = process.argv.slice(2);
  const startUrlArgIndex = args.indexOf('--start-url');
  const outputArgIndex = args.indexOf('--output');
  const rateArgIndex = args.indexOf('--rate');
  const limitArgIndex = args.indexOf('--limit');

  const startUrl = startUrlArgIndex !== -1 ? args[startUrlArgIndex + 1] : 'https://www.thesouledstore.com/sitemap.xml';
  const output = outputArgIndex !== -1 ? args[outputArgIndex + 1] : 'products.json';
  const rate = rateArgIndex !== -1 ? Number(args[rateArgIndex + 1]) : 1;
  const doUpsert = args.includes('--upsert');
  const limit = limitArgIndex !== -1 ? Number(args[limitArgIndex + 1]) : Infinity;

  try {
    const start = new URL(startUrl);
    if (!(await isAllowed(start))) {
      throw new Error(`robots.txt disallows crawling ${start.origin}`);
    }

  const discovered = await discoverUrls(start, { rate });
  const urlsPath = output.replace('.json', '.urls.json');
  writeFileSync(urlsPath, JSON.stringify(discovered, null, 2));

    const products = [] as any[];
    let client: any = null;
    if (doUpsert) {
      client = await getPgClient();
      await ensureSchema(client);
    }

    const toProcess = discovered.productUrls.slice(0, Number.isFinite(limit) ? limit : undefined);
    for (const url of toProcess) {
      const p = await fetchAndExtractProduct(new URL(url));
      if (p) products.push(p);
      if (p && doUpsert) {
        await upsertProduct(client, p);
      }
    }

    writeFileSync(output, JSON.stringify(products, null, 2));
    // Admin report for licensing
    const report = products.map(p => ({
      source_product_url: p.source_product_url,
      title: p.title,
      images_flagged: (p.images || []).filter((i: any) => i.licensed_for_use !== 'permission_granted').length,
      description_long_present: Boolean(p.description_long),
    }));
    writeFileSync(output.replace('.json', '.report.json'), JSON.stringify(report, null, 2));

    console.log(`Discovered ${toProcess.length} product URLs (saved ${urlsPath}).`);
    console.log(`Saved ${products.length} products to ${output}${doUpsert ? ' and upserted to DB' : ''}`);
    if (client) await client.end();
  } catch (err) {
    console.error('Crawler error:', err);
    process.exit(1);
  }
}

main();
