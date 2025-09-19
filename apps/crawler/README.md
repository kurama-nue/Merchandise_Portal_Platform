# ArtisanX Focused Crawler (Souled Store)

Purpose: Discover product URLs from thesouledstore.com via sitemap and extract minimal structured product data to integrate into this existing project, while respecting legal and robots rules.

Legal constraints:
- Do not download or republish copyrighted images or full-length product descriptions without permission.
- Store only source_image_url and short paraphrased description (<=25 words) unless licensed.
- Set `licensed_for_use` to `unknown` by default.

Features:
- Polite crawling with 1 req/sec, retry/backoff, robots.txt check.
- Sitemap-based URL discovery.
- HTML + JSON-LD extraction for title, price, images.
- Optional Postgres upsert with `--upsert` (uses `DATABASE_URL`).

Install & Run:

```pwsh
# From repo root, install deps for crawler
cd apps/crawler
npm install

# Discover URLs and extract sample products, write JSON only
npm run dev -- --start-url "https://www.thesouledstore.com/sitemap.xml" --rate 1 --output products.json

# Extract and upsert into Postgres (requires DATABASE_URL in .env)
$env:DATABASE_URL = "postgres://user:pass@host:5432/dbname"
npm run dev -- --start-url "https://www.thesouledstore.com/sitemap.xml" --rate 1 --output products.json --upsert
```

Output files:
- `products.urls.json` — discovered URLs.
- `products.json` — extracted canonical product JSON.

Notes:
- This is a focused, light-touch integration to enrich your existing app with structured data and UX reference. It is not a mirror or clone.
- Enhance selectors in `src/extract.ts` as needed for better accuracy.
