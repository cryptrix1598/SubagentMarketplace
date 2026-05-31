import { Metadata } from "next";
import { ExplorePageClient } from "./explore-client";

export const metadata: Metadata = {
  title: "Explore Agents",
  description: "Browse and discover Claude Code subagents. Search by category, tags, or popularity.",
};

export default function ExplorePage() {
  return <ExplorePageClient />;
}