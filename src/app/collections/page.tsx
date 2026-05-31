import { Metadata } from "next";
import { getPublicCollections } from "@/actions/collection";
import { CollectionsPageClient } from "./collections-client";

export const metadata: Metadata = {
  title: "Collections",
  description: "Browse curated collections of Claude Code subagents.",
};

export default async function CollectionsPage() {
  const result = await getPublicCollections();
  const collections = result.success && result.data ? result.data.items || [] : [];

  return <CollectionsPageClient collections={collections} />;
}