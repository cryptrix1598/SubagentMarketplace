import { describe, it, expect, beforeEach } from "vitest";
import { rateLimit } from "@/server/rate-limit";

describe("Rate Limiter", () => {
  it("allows requests within limit", () => {
    const limiter = rateLimit({ max: 5, windowMs: 60000, keyPrefix: "test" });

    for (let i = 0; i < 5; i++) {
      const result = limiter("user1");
      expect(result.allowed).toBe(true);
    }
  });

  it("blocks requests exceeding limit", () => {
    const limiter = rateLimit({ max: 3, windowMs: 60000, keyPrefix: "test2" });

    limiter("user2");
    limiter("user2");
    limiter("user2");

    const result = limiter("user2");
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("tracks remaining count correctly", () => {
    const limiter = rateLimit({ max: 5, windowMs: 60000, keyPrefix: "test3" });

    const result1 = limiter("user3");
    expect(result1.remaining).toBe(4);

    const result2 = limiter("user3");
    expect(result2.remaining).toBe(3);
  });

  it("isolates different identifiers", () => {
    const limiter = rateLimit({ max: 2, windowMs: 60000, keyPrefix: "test4" });

    limiter("user4a");
    limiter("user4a");

    const resultA = limiter("user4a");
    expect(resultA.allowed).toBe(false);

    const resultB = limiter("user4b");
    expect(resultB.allowed).toBe(true);
  });
});