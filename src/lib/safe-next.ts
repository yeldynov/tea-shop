/** Only same-site paths. Parses like a browser, so tricks like `//evil.com`,
 *  `/\evil.com` or `/\t/evil.com` resolve to their real host and are rejected. */
export function safeNext(value: unknown, fallback = "/account") {
  if (typeof value !== "string" || !value.startsWith("/")) return fallback;
  const base = "http://n";
  const url = URL.parse(value, base);
  return url?.origin === base ? url.pathname + url.search + url.hash : fallback;
}
