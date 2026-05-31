import { Metadata } from "next";
import { PublishPageClient } from "./publish-client";

export const metadata: Metadata = {
  title: "Publish Agent",
  description: "Publish your Claude Code subagent to the marketplace.",
};

export default function PublishPage() {
  return <PublishPageClient />;
}