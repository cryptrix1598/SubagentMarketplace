import { Metadata } from "next";
import { getPublicBundles } from "@/actions/bundle";
import { BundlesPageClient } from "./bundles-client";

export const metadata: Metadata = {
  title: "Agent Bundles",
  description: "Browse curated bundles of Claude Code subagents for complete workflows.",
};

export default async function BundlesPage() {
  const result = await getPublicBundles();
  const bundles = result.success && result.data ? result.data.items || [] : [];

  return <BundlesPageClient bundles={bundles} />;
}