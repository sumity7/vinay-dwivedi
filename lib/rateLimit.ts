/** Small in-memory limiter per IP (per server instance): true when the caller is over `max` hits in `windowMs`. */
export function makeLimiter(windowMs: number, max: number) {
  const hits = new Map<string, number[]>();
  return (request: Request) => {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
    recent.push(now);
    hits.set(ip, recent);
    if (hits.size > 5000) hits.clear();
    return recent.length > max;
  };
}
