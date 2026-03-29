type RateLimitEntry = {
  count: number;
  lastRequest: number;
};

const rateLimitMap = new Map<string, RateLimitEntry>();

export function rateLimit(
  key: string,
  limit = 5,
  windowMs = 60 * 1000 // 1 min
) {
  const now = Date.now();

  const entry = rateLimitMap.get(key);

  if (!entry) {
    rateLimitMap.set(key, { count: 1, lastRequest: now });
    return { success: true };
  }

  if (now - entry.lastRequest > windowMs) {
    rateLimitMap.set(key, { count: 1, lastRequest: now });
    return { success: true };
  }

  if (entry.count >= limit) {
    return { success: false };
  }

  entry.count++;
  rateLimitMap.set(key, entry);

  return { success: true };
}