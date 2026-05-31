"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FolderOpen, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Collection {
  id: string;
  title: string;
  description: string | null;
  user: { id: string; username: string; displayName: string; avatarUrl: string | null };
  _count?: { agents: number };
}

export function CollectionsPageClient({ collections }: { collections: Collection[] }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Collections</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Curated lists of agents for specific workflows and use cases.
        </p>
      </div>

      {collections.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="group h-full transition-all hover:border-orange-500/30 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                    <FolderOpen className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold group-hover:text-orange-500 transition-colors">
                    {collection.title}
                  </h3>
                  {collection.description && (
                    <p className="mt-1 text-sm text-muted-foreground">{collection.description}</p>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                    <Badge variant="secondary">
                      <Package className="mr-1 h-3 w-3" />
                      {collection._count?.agents || 0} agents
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={collection.user.avatarUrl || ""} />
                        <AvatarFallback className="text-[8px]">
                          {(collection.user.displayName || collection.user.username)[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">{collection.user.displayName || collection.user.username}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FolderOpen className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold">No collections yet</h3>
          <p className="mt-2 text-muted-foreground">Create your first collection!</p>
        </div>
      )}
    </div>
  );
}