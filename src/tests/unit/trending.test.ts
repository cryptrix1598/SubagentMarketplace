import { describe, it, expect } from "vitest";
import {
  calculateTrendingScore,
  calculateGrowthRate,
  calculateEngagement,
} from "@/lib/trending";

describe("Trending Algorithm", () => {
  describe("calculateTrendingScore", () => {
    it("should return 0 for an agent with zero metrics", () => {
      const score = calculateTrendingScore({
        downloads: 0,
        recentDownloads: 0,
        stars: 0,
        growthRate: 0,
        engagement: 0,
      });
      expect(score).toBe(0);
    });

    it("should return a positive score for an agent with downloads", () => {
      const score = calculateTrendingScore({
        downloads: 1000,
        recentDownloads: 100,
        stars: 50,
        growthRate: 0.1,
        engagement: 0.5,
      });
      expect(score).toBeGreaterThan(0);
    });

    it("should weight recent downloads more heavily than total downloads", () => {
      const scoreOld = calculateTrendingScore({
        downloads: 10000,
        recentDownloads: 10,
        stars: 100,
        growthRate: 0,
        engagement: 0.1,
      });

      const scoreNew = calculateTrendingScore({
        downloads: 1000,
        recentDownloads: 500,
        stars: 50,
        growthRate: 0.5,
        engagement: 0.8,
      });

      expect(scoreNew).toBeGreaterThan(scoreOld);
    });

    it("should handle very large numbers without overflow", () => {
      const score = calculateTrendingScore({
        downloads: 10000000,
        recentDownloads: 1000000,
        stars: 500000,
        growthRate: 2.0,
        engagement: 0.9,
      });
      expect(isFinite(score)).toBe(true);
      expect(score).toBeGreaterThan(0);
    });
  });

  describe("calculateGrowthRate", () => {
    it("should return capped growth when previous value is 0", () => {
      expect(calculateGrowthRate(100, 0)).toBe(10);
    });

    it("should calculate positive growth rate", () => {
      const rate = calculateGrowthRate(150, 100);
      expect(rate).toBeCloseTo(0.5, 2);
    });

    it("should calculate negative growth rate", () => {
      const rate = calculateGrowthRate(50, 100);
      expect(rate).toBeCloseTo(-0.5, 2);
    });

    it("should return 0 when both values are 0", () => {
      expect(calculateGrowthRate(0, 0)).toBe(0);
    });

    it("should handle same values (no growth)", () => {
      expect(calculateGrowthRate(100, 100)).toBe(0);
    });
  });

  describe("calculateEngagement", () => {
    it("should return 0 when views is 0", () => {
      expect(calculateEngagement(0, 0, 0, 0)).toBe(0);
    });

    it("should calculate engagement from downloads, stars, and reviews relative to views", () => {
      const engagement = calculateEngagement(1000, 100, 50, 10);
      expect(engagement).toBeGreaterThan(0);
    });

    it("should increase with high activity", () => {
      const engagement = calculateEngagement(100, 500, 200, 20);
      expect(engagement).toBeGreaterThan(100);
    });
  });
});
