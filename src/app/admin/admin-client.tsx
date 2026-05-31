"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Package,
  Download,
  MessageSquare,
  Building2,
  Flag,
  AlertTriangle,
  TrendingUp,
  UserPlus,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatNumber } from "@/lib/utils";

interface AdminStats {
  totalUsers: number;
  totalAgents: number;
  totalDownloads: number;
  totalReviews: number;
  totalOrganizations: number;
  totalReports: number;
  pendingReports: number;
  usersByRole: Record<string, number>;
  agentsByCategory: Record<string, number>;
  recentSignups: number;
  recentPublishedAgents: number;
}

export function AdminPageClient({ stats }: { stats: AdminStats | null }) {
  const statCards = [
    { title: "Total Users", value: stats?.totalUsers ?? 0, icon: Users, color: "text-blue-500" },
    { title: "Total Agents", value: stats?.totalAgents ?? 0, icon: Package, color: "text-orange-500" },
    { title: "Total Downloads", value: stats?.totalDownloads ?? 0, icon: Download, color: "text-green-500" },
    { title: "Total Reviews", value: stats?.totalReviews ?? 0, icon: MessageSquare, color: "text-purple-500" },
    { title: "Organizations", value: stats?.totalOrganizations ?? 0, icon: Building2, color: "text-cyan-500" },
    { title: "Pending Reports", value: stats?.pendingReports ?? 0, icon: AlertTriangle, color: "text-red-500" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-orange-500" />
          <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
        </div>
        <p className="mt-2 text-muted-foreground">
          System administration and moderation tools.
        </p>
      </div>

      {/* Stats Grid */}
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
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <p className="mt-2 text-3xl font-bold">{formatNumber(stat.value)}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-blue-500" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-foreground/5 p-3">
                <span className="text-sm">New Signups (30d)</span>
                <Badge variant="info">{stats?.recentSignups ?? 0}</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-foreground/5 p-3">
                <span className="text-sm">New Agents (30d)</span>
                <Badge variant="success">{stats?.recentPublishedAgents ?? 0}</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-foreground/5 p-3">
                <span className="text-sm">Pending Reports</span>
                <Badge variant={stats?.pendingReports ? "destructive" : "success"}>
                  {stats?.pendingReports ?? 0}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                Agents by Category
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats?.agentsByCategory &&
                Object.entries(stats.agentsByCategory)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 8)
                  .map(([category, count]) => {
                    const maxCount = Math.max(...Object.values(stats.agentsByCategory));
                    return (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{category.toLowerCase().replace("_", " ")}</span>
                          <span className="text-muted-foreground">{count}</span>
                        </div>
                        <Progress value={(count / maxCount) * 100} className="h-2" />
                      </div>
                    );
                  })}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Users by Role */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Users by Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-4">
              {stats?.usersByRole &&
                Object.entries(stats.usersByRole).map(([role, count]) => (
                  <div key={role} className="rounded-lg border p-4 text-center">
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-sm text-muted-foreground">{role}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}