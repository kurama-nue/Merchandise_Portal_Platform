import { politeFetch } from './politeFetch.js';

export async function isAllowed(url: URL): Promise<boolean> {
  try {
    const robotsUrl = new URL('/robots.txt', url.origin).toString();
    const res = await politeFetch(robotsUrl);
    if (!res.ok) return true; // assume allowed if robots not accessible
    const text = await res.text();

    // Simple disallow check for '*'
    const lines = text.split(/\r?\n/);
    let active = false;
    const disallows: string[] = [];
    for (const line of lines) {
      const l = line.trim();
      if (/^User-agent:\s*\*/i.test(l)) {
        active = true;
      } else if (/^User-agent:/i.test(l)) {
        active = false;
      } else if (active && /^Disallow:/i.test(l)) {
        const path = l.split(':')[1]?.trim() || '';
        disallows.push(path);
      }
    }

    const path = url.pathname;
    return !disallows.some(d => d && path.startsWith(d));
  } catch {
    return true;
  }
}
