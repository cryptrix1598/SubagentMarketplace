import { TRENDING_WEIGHTS } from "@/lib/constants";

interface TrendingInput {
  downloads: number;
  recentDownloads: number;
  stars: number;
  growthRate: number;
  engagement: number;
}

export function calculateTrendingScore(input: TrendingInput): number {
  const { DOWNLOADS, RECENT_DOWNLOADS, STARS, GROWTH, ENGAGEMENT } = TRENDING_WEIGHTS;

  const normalizedDownloads = Math.log10(input.downloads + 1);
  const normalizedRecentDownloads = Math.log10(input.recentDownloads + 1);
  const normalizedStars = Math.log10(input.stars + 1);
  const normalizedGrowth = Math.min(input.growthRate, 10);
  const normalizedEngagement = Math.log10(input.engagement + 1);

  return (
    normalizedDownloads * DOWNLOADS +
    normalizedRecentDownloads * RECENT_DOWNLOADS +
    normalizedStars * STARS +
    normalizedGrowth * GROWTH +
    normalizedEngagement * ENGAGEMENT
  );
}

export function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 10 : 0;
  return (current - previous) / previous;
}

export function calculateEngagement(
  views: number,
  downloads: number,
  stars: number,
  reviews: number,
): number {
  if (views === 0) return 0;
  return ((downloads + stars * 5 + reviews * 10) / views) * 100;
}