"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Download, GitFork, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatNumber, formatRelativeTime, truncate } from "@/lib/utils";
import { generateInstallCommand } from "@/lib/install-commands";
import type { AgentListItem } from "@/types";

interface AgentCardProps {
  agent: AgentListItem;
  index?: number;
}

export function AgentCard({ agent, index = 0 }: AgentCardProps) {
  const installCommand = generateInstallCommand(agent.publisher.username, agent.slug);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/@${agent.publisher.username}/${agent.slug}`}>
        <Card className="group h-full cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-200 hover:border-primary/30 hover:bg-card hover:shadow-lg hover:shadow-primary/5">
          <CardContent className="p-5">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-bold">
                  {agent.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="truncate font-semibold leading-tight group-hover:text-primary">
                      {agent.name}
                    </h3>
                    {agent.isVerified && (
                      <Badge variant="success" className="h-4 px-1 text-[10px]">
                        ✓
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    @{agent.publisher.username}
                    {agent.publisher.isVerified && " ✓"}
                  </p>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>

            <p className="mb-3 text-sm text-muted-foreground leading-relaxed">
              {truncate(agent.description, 120)}
            </p>

            {agent.tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {agent.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag.tag} variant="secondary" className="text-xs">
                    {tag.tag}
                  </Badge>
                ))}
                {agent.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{agent.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  {formatNumber(agent.downloads)}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {formatNumber(agent.starsCount)}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="h-3 w-3" />
                  {formatNumber(agent.forksCount)}
                </span>
              </div>
              <span>{formatRelativeTime(agent.updatedAt)}</span>
            </div>

            <div className="mt-3 rounded-md bg-muted/50 px-2.5 py-1.5">
              <code className="text-xs text-muted-foreground">
                {installCommand}
              </code>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}