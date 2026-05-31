"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package, Download, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatNumber } from "@/lib/utils";

interface Bundle {
  id: string;
  name: string;
  slug: string;
  description: string;
  downloads: number;
  user: { id: string; username: string; displayName: string; avatarUrl: string | null };
  _count?: { agents: number };
}

export function BundlesPageClient({ bundles }: { bundles: Bundle[] }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Agent Bundles</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Curated collections of agents for complete workflows.
        </p>
      </div>

      {bundles.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bundles.map((bundle, index) => (
            <motion.div
              key={bundle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="group h-full transition-all hover:border-orange-500/30 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl gradient-bg text-white">
                      <Layers className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-semibold group-hover:text-orange-500 transition-colors">
                        {bundle.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">{bundle.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">
                        <Package className="mr-1 h-3 w-3" />
                        {bundle._count?.agents || 0} agents
                      </Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Download className="h-3 w-3" />
                        {formatNumber(bundle.downloads)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={bundle.user.avatarUrl || ""} />
                        <AvatarFallback className="text-[8px]">
                          {(bundle.user.displayName || bundle.user.username)[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">
                        {bundle.user.displayName || bundle.user.username}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg bg-foreground/5 p-2 font-mono text-xs">
                    <span className="text-muted-foreground">$</span>{" "}
                    <span className="text-orange-500">claude bundle install</span>{" "}
                    <span className="text-foreground">{bundle.user.username}/{bundle.slug}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Layers className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold">No bundles yet</h3>
          <p className="mt-2 text-muted-foreground">Be the first to create a bundle!</p>
          <Link href="/dashboard">
            <Button variant="gradient" className="mt-4">Create Bundle</Button>
          </Link>
        </div>
      )}
    </div>
  );
}