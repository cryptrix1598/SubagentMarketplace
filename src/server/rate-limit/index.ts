const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitOptions {
  max: number;
  windowMs: number;
  keyPrefix?: string;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

export function rateLimit(options: RateLimitOptions): (identifier: string) => RateLimitResult {
  const { max, windowMs, keyPrefix = "rl" } = options;

  return (identifier: string): RateLimitResult => {
    const key = `${keyPrefix}:${identifier}`;
    const now = Date.now();

    const record = rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
      const resetTime = now + windowMs;
      rateLimitStore.set(key, { count: 1, resetTime });
      return { allowed: true, remaining: max - 1, resetTime };
    }

    if (record.count >= max) {
      return { allowed: false, remaining: 0, resetTime: record.resetTime };
    }

    record.count += 1;
    return { allowed: true, remaining: max - record.count, resetTime: record.resetTime };
  };
}

export const apiRateLimit = rateLimit({
  max: parseInt(process.env["RATE_LIMIT_MAX"] || "100"),
  windowMs: parseInt(process.env["RATE_LIMIT_WINDOW"] || "60000"),
});

export const publishRateLimit = rateLimit({
  max: 10,
  windowMs: 60 * 60 * 1000,
  keyPrefix: "publish",
});

export const reviewRateLimit = rateLimit({
  max: 20,
  windowMs: 60 * 60 * 1000,
  keyPrefix: "review",
});

export const authRateLimit = rateLimit({
  max: 5,
  windowMs: 60 * 1000,
  keyPrefix: "auth",
});

// Cleanup expired entries periodically
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }, 60 * 1000);
}