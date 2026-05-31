import { Metadata } from "next";
import { getAgentsByCategory } from "@/actions/agent";
import { CategoriesPageClient } from "./categories-client";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse Claude Code subagents by category.",
};

export default async function CategoriesPage() {
  const result = await getAgentsByCategory();
  const categories = result.success ? result.data || {} : {};

  return <CategoriesPageClient categories={categories} />;
}