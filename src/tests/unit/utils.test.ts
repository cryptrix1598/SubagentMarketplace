import { describe, it, expect } from "vitest";
import { formatNumber, slugify, truncate } from "@/lib/utils";
import { calculateTrendingScore, calculateGrowthRate, calculateEngagement } from "@/lib/trending";
import { generateInstallCommand, generateUpdateCommand, parseAgentIdentifier } from "@/lib/install-commands";

describe("formatNumber", () => {
  it("formats numbers under 1000 as-is", () => {
    expect(formatNumber(0)).toBe("0");
    expect(formatNumber(42)).toBe("42");
    expect(formatNumber(999)).toBe("999");
  });

  it("formats thousands with K suffix", () => {
    expect(formatNumber(1000)).toBe("1.0K");
    expect(formatNumber(1500)).toBe("1.5K");
    expect(formatNumber(999999)).toBe("1000.0K");
  });

  it("formats millions with M suffix", () => {
    expect(formatNumber(1000000)).toBe("1.0M");
    expect(formatNumber(2500000)).toBe("2.5M");
  });
});

describe("slugify", () => {
  it("converts text to URL-safe slugs", () => {
    expect(slugify("Hello World")).toBe("hello-world");
    expect(slugify("My Awesome Agent!")).toBe("my-awesome-agent");
    expect(slugify("Test   Multiple   Spaces")).toBe("test-multiple-spaces");
  });

  it("handles special characters", () => {
    expect(slugify("Agent@V2.0")).toBe("agentv20");
    expect(slugify("C++ Agent")).toBe("c-agent");
  });

  it("truncates long slugs", () => {
    const longName = "a".repeat(200);
    expect(slugify(longName).length).toBeLessThanOrEqual(128);
  });
});

describe("truncate", () => {
  it("returns text as-is if shorter than limit", () => {
    expect(truncate("Hello", 10)).toBe("Hello");
  });

  it("truncates and adds ellipsis", () => {
    expect(truncate("Hello World!", 5)).toBe("Hello…");
  });
});

describe("calculateTrendingScore", () => {
  it("returns higher scores for agents with more activity", () => {
    const popular = calculateTrendingScore({
      downloads: 10000,
      recentDownloads: 1000,
      stars: 500,
      growthRate: 2,
      engagement: 10,
    });

    const unpopular = calculateTrendingScore({
      downloads: 10,
      recentDownloads: 1,
      stars: 1,
      growthRate: 0,
      engagement: 0.1,
    });

    expect(popular).toBeGreaterThan(unpopular);
  });

  it("weights recent downloads more heavily", () => {
    const recentPopular = calculateTrendingScore({
      downloads: 100,
      recentDownloads: 1000,
      stars: 50,
      growthRate: 5,
      engagement: 5,
    });

    const historicalPopular = calculateTrendingScore({
      downloads: 10000,
      recentDownloads: 10,
      stars: 50,
      growthRate: 0,
      engagement: 5,
    });

    expect(recentPopular).toBeGreaterThan(historicalPopular);
  });
});

describe("calculateGrowthRate", () => {
  it("calculates positive growth", () => {
    expect(calculateGrowthRate(200, 100)).toBe(1);
  });

  it("calculates negative growth", () => {
    expect(calculateGrowthRate(50, 100)).toBe(-0.5);
  });

  it("handles zero previous value", () => {
    expect(calculateGrowthRate(100, 0)).toBe(10);
    expect(calculateGrowthRate(0, 0)).toBe(0);
  });
});

describe("calculateEngagement", () => {
  it("calculates engagement percentage", () => {
    const engagement = calculateEngagement(1000, 100, 50, 10);
    expect(engagement).toBeGreaterThan(0);
  });

  it("returns 0 for zero views", () => {
    expect(calculateEngagement(0, 100, 50, 10)).toBe(0);
  });
});

describe("install commands", () => {
  it("generates install command", () => {
    expect(generateInstallCommand("anthropic", "coder")).toBe(
      "claude agent install anthropic/coder",
    );
  });

  it("generates update command with version", () => {
    expect(generateUpdateCommand("anthropic", "coder", "1.2.0")).toBe(
      "claude agent update anthropic/coder@1.2.0",
    );
  });

  it("generates update command without version", () => {
    expect(generateUpdateCommand("anthropic", "coder")).toBe(
      "claude agent update anthropic/coder",
    );
  });
});

describe("parseAgentIdentifier", () => {
  it("parses publisher/agent format", () => {
    const result = parseAgentIdentifier("anthropic/coder");
    expect(result).toEqual({ publisher: "anthropic", agent: "coder", version: undefined });
  });

  it("parses publisher/agent@version format", () => {
    const result = parseAgentIdentifier("anthropic/coder@1.2.0");
    expect(result).toEqual({ publisher: "anthropic", agent: "coder", version: "1.2.0" });
  });

  it("returns null for invalid format", () => {
    expect(parseAgentIdentifier("invalid")).toBeNull();
    expect(parseAgentIdentifier("")).toBeNull();
  });
});
