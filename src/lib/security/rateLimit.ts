interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/**
 * Best-effort, in-process rate limiter. Resets on cold start/redeploy and
 * isn't shared across serverless instances, so it's not a hard guarantee —
 * just a cheap deterrent against casual abuse without adding an external
 * dependency (Redis/Upstash) for the MVP. Upgrade path noted in README if
 * real protection is needed later.
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= limit) return false;

  bucket.count += 1;
  return true;
}
