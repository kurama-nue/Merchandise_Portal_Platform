import fetch from 'cross-fetch';
import pRetry from 'p-retry';

const DEFAULT_RATE = 1; // req/sec
let lastFetch = 0;

export async function politeFetch(url: string, init?: RequestInit, rate = DEFAULT_RATE) {
  const minInterval = 1000 / Math.max(rate, 1);
  const now = Date.now();
  const wait = Math.max(0, minInterval - (now - lastFetch));
  if (wait > 0) await new Promise(res => setTimeout(res, wait));

  const userAgent = `ArtisanX-Crawler/0.1 (+contact: ops@artisanx.example; ${new URL(url).origin})`;

  const doFetch = async () => {
    const res = await fetch(url, {
      ...init,
      headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        ...init?.headers as any,
      },
    } as any);
    if (res.status === 429 || res.status >= 500) {
      throw new pRetry.AbortError(`HTTP ${res.status} for ${url}`);
    }
    return res;
  };

  const res = await pRetry(doFetch, { retries: 3, factor: 2, minTimeout: 500 });
  lastFetch = Date.now();
  return res;
}
