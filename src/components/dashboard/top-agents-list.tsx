"use client";

import Link from "next/link";
import { formatNumber } from "@/lib/utils";
import { Download, Star } from "lucide-react";
import type { AgentListItem } from "@/types";

interface TopAgentsListProps {
  agents: AgentListItem[];
}

export function TopAgentsList({ agents }: TopAgentsListProps) {
  if (agents.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No agents published yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {agents.map((agent, index) => (
        <Link
          key={agent.id}
          href={`/@${agent.publisher.username}/${agent.slug}`}
          className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
        >
          <span className="w-6 text-center text-sm font-medium text-muted-foreground">
            {index + 1}
          </span>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">
            {agent.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium">{agent.name}</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {formatNumber(agent.downloads)}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              {formatNumber(agent.starsCount)}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}