type RateLimitEntry = {
  count: number;
  resetAt: number;
};

export class InMemoryRateLimiter {
  private readonly store = new Map<string, RateLimitEntry>();

  constructor(
    private readonly maxRequests: number,
    private readonly windowMs: number,
  ) {}

  consume(key: string) {
    const now = Date.now();
    const existing = this.store.get(key);

    if (!existing || existing.resetAt <= now) {
      this.store.set(key, { count: 1, resetAt: now + this.windowMs });
      return { allowed: true, remaining: this.maxRequests - 1 };
    }

    if (existing.count >= this.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        retryAfterMs: existing.resetAt - now,
      };
    }

    existing.count += 1;
    this.store.set(key, existing);

    return {
      allowed: true,
      remaining: this.maxRequests - existing.count,
    };
  }
}
