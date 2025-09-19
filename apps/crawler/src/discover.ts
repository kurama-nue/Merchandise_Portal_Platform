import { XMLParser } from 'fast-xml-parser';
import { politeFetch } from './politeFetch.js';

export interface DiscoverResult {
  categoryUrls: string[];
  productUrls: string[];
}

export async function discoverUrls(startUrl: URL, opts: { rate?: number } = {}): Promise<DiscoverResult> {
  const productUrls = new Set<string>();
  const categoryUrls = new Set<string>();

  // Try sitemap first
  if (startUrl.pathname.endsWith('.xml')) {
    const parser = new XMLParser({ ignoreAttributes: false });

    async function parseSitemap(url: string, depth = 0) {
      if (depth > 3) return; // avoid deep recursion
      const res = await politeFetch(url, undefined, opts.rate);
      if (!res.ok) return;
      const xml = await res.text();
      const json = parser.parse(xml);

      // sitemap index
      if (json.sitemapindex?.sitemap) {
        const children: string[] = (json.sitemapindex.sitemap || [])
          .map((s: any) => s.loc)
          .filter((u: string) => typeof u === 'string');
        for (const child of children) await parseSitemap(child, depth + 1);
        return;
      }

      // urlset
      const urls: string[] = (json.urlset?.url || [])
        .map((u: any) => (typeof u === 'string' ? u : u.loc))
        .filter((u: string) => typeof u === 'string');
      for (const u of urls) {
        if (/\/product\//i.test(u) || /\/products\//i.test(u)) productUrls.add(u);
        if (/\/category\//i.test(u) || /\/categories\//i.test(u) || /\/men\//i.test(u) || /\/women\//i.test(u)) categoryUrls.add(u);
      }
    }

    await parseSitemap(startUrl.toString());
  }

  return {
    categoryUrls: Array.from(categoryUrls),
    productUrls: Array.from(productUrls),
  };
}
