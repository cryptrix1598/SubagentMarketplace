"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Download, Star, Verified } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatNumber } from "@/lib/utils";
import type { AgentListItem } from "@/types";

interface TrendingAgentsProps {
  agents: AgentListItem[];
}

export function TrendingAgentsSection({ agents }: TrendingAgentsProps) {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Trending <span className="gradient-text">agents</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The most popular agents right now, ranked by community activity.
            </p>
          </div>
          <Link href="/explore">
            <Button variant="ghost" className="hidden sm:flex">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agents.slice(0, 6).map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={`/@${agent.publisher.username}/${agent.slug}`}
                className="group flex items-start gap-4 rounded-xl border border-border/50 bg-card/50 p-5 transition-all hover:border-orange-500/30 hover:bg-card hover:shadow-lg"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                  <span className="text-lg font-bold">{agent.name[0]}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-semibold group-hover:text-orange-500 transition-colors">
                      {agent.name}
                    </h3>
                    {agent.isVerified && (
                      <Verified className="h-4 w-4 shrink-0 text-orange-500" />
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {agent.description}
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {formatNumber(agent.downloads)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {formatNumber(agent.starsCount)}
                    </span>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {agent.category.toLowerCase().replace("_", "-")}
                    </Badge>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/explore">
            <Button variant="outline">
              View All Agents
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}