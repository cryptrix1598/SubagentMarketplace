"use client";

import { AgentCard } from "./agent-card";
import type { AgentListItem } from "@/types";

interface AgentGridProps {
  agents: AgentListItem[];
  emptyMessage?: string;
}

export function AgentGrid({ agents, emptyMessage = "No agents found" }: AgentGridProps) {
  if (agents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 text-4xl">🔍</div>
        <h3 className="mb-1 text-lg font-semibold">{emptyMessage}</h3>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {agents.map((agent, index) => (
        <AgentCard key={agent.id} agent={agent} index={index} />
      ))}
    </div>
  );
}