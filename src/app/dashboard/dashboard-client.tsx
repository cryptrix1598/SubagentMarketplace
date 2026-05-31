"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Download,
  Eye,
  Star,
  TrendingUp,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatNumber, cn } from "@/lib/utils";
import type { DashboardStats, AgentListItem } from "@/types";

interface DashboardClientProps {
  stats: DashboardStats | null;
}

export function DashboardClient({ stats }: DashboardClientProps) {
  const statCards = [
    {
      title: "Total Agents",
      value: stats?.totalAgents ?? 0,
      icon: Package,
      format: false,
    },
    {
      title: "Total Downloads",
      value: stats?.totalDownloads ?? 0,
      icon: Download,
      format: true,
    },
    {
      title: "Total Views",
      value: stats?.totalViews ?? 0,
      icon: Eye,
      format: true,
    },
    {
      title: "Total Stars",
      value: stats?.totalStars ?? 0,
      icon: Star,
      format: true,
    },
    {
      title: "Weekly Downloads",
      value: stats?.weeklyDownloads ?? 0,
      icon: TrendingUp,
      format: true,
    },
    {
      title: "Avg Rating",
      value: stats?.averageRating ?? 0,
      icon: BarChart3,
      format: false,
      suffix: "/5",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Track your agents&apos; performance and growth.
          </p>
        </div>
        <Link href="/publish">
          <Button variant="gradient">
            <Plus className="mr-2 h-4 w-4" />
            Publish Agent
          </Button>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <stat.icon className="h-4 w-4 text-orange-500" />
                </div>
                <p className="mt-2 text-3xl font-bold">
                  {stat.format ? formatNumber(stat.value) : stat.value.toFixed(1)}
                  {stat.suffix && (
                    <span className="text-lg text-muted-foreground">{stat.suffix}</span>
                  )}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Growth Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              {(stats?.growthRate ?? 0) >= 0 ? (
                <ArrowUpRight className="h-5 w-5 text-green-500" />
              ) : (
                <ArrowDownRight className="h-5 w-5 text-red-500" />
              )}
              <span className="text-2xl font-bold">
                {Math.abs(stats?.growthRate ?? 0).toFixed(1)}%
              </span>
              <span className="text-sm text-muted-foreground">vs last 30 days</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Downloads Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Downloads (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-end gap-1">
              {(stats?.downloadsByDay || Array.from({ length: 30 }, () => ({ date: "", count: 0 }))).map(
                (day, i) => {
                  const maxCount = Math.max(
                    ...(stats?.downloadsByDay || []).map((d) => d.count),
                    1,
                  );
                  const height = (day.count / maxCount) * 100;
                  return (
                    <div
                      key={i}
                      className="flex-1 rounded-t bg-orange-500/30 transition-all hover:bg-orange-500/50"
                      style={{ height: `${Math.max(height, 2)}%` }}
                      title={`${day.date}: ${day.count} downloads`}
                    />
                  );
                },
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Agents */}
      {stats?.topAgents && stats.topAgents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Your Top Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topAgents.map((agent: AgentListItem, index: number) => (
                  <Link
                    key={agent.id}
                    href={`/@${agent.publisher.username}/${agent.slug}`}
                    className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-accent"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-center text-sm font-medium text-muted-foreground">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium">{agent.name}</p>
                        <p className="text-xs text-muted-foreground">{agent.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}