import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAgent } from "@/actions/agent";
import { AgentPageClient } from "./agent-client";

interface AgentPageProps {
  params: Promise<{ username: string; slug: string }>;
}

export async function generateMetadata({ params }: AgentPageProps): Promise<Metadata> {
  const { username, slug } = await params;
  const result = await getAgent(slug, username.replace("%40", "").replace("@", ""));

  if (!result.success || !result.data) {
    return { title: "Agent Not Found" };
  }

  const agent = result.data;
  return {
    title: `${agent.name} — ${agent.publisher.displayName || agent.publisher.username}`,
    description: agent.description,
    openGraph: {
      title: `${agent.name} — Claude Agent Hub`,
      description: agent.description,
      type: "article",
      publishedTime: agent.publishedAt?.toISOString(),
      authors: [agent.publisher.username],
    },
  };
}

export default async function AgentPage({ params }: AgentPageProps) {
  const { username, slug } = await params;
  const cleanUsername = username.replace("%40", "").replace("@", "");
  const result = await getAgent(slug, cleanUsername);

  if (!result.success || !result.data) {
    notFound();
  }

  return <AgentPageClient agent={result.data} />;
}