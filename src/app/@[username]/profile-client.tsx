"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  Link as LinkIcon,
  Github,
  Twitter,
  Download,
  Star,
  Users,
  Package,
  Verified,
  UserPlus,
  UserMinus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toggleFollow } from "@/actions/follow";
import { formatNumber } from "@/lib/utils";
import type { UserWithStats, AgentListItem } from "@/types";

interface ProfilePageClientProps {
  user: UserWithStats;
  agents: AgentListItem[];
  isFollowing: boolean;
}

export function ProfilePageClient({ user, agents, isFollowing: initialFollowing }: ProfilePageClientProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const [followersCount, setFollowersCount] = useState(user._count?.followers || 0);

  const handleToggleFollow = async () => {
    const result = await toggleFollow(user.id);
    if (result.success && result.data) {
      setFollowing(result.data.following);
      setFollowersCount((prev) => prev + (result.data!.following ? 1 : -1));
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.avatarUrl || ""} />
            <AvatarFallback className="text-2xl bg-orange-500/10 text-orange-500">
              {(user.displayName || user.username)[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-3xl font-bold">{user.displayName || user.username}</h1>
              {user.isVerified && <Verified className="h-6 w-6 text-orange-500" />}
            </div>
            <p className="mt-1 text-muted-foreground">@{user.username}</p>

            {user.bio && <p className="mt-3 text-muted-foreground">{user.bio}</p>}

            <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground sm:justify-start">
              {user.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {user.location}
                </span>
              )}
              {user.website && (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-orange-500 transition-colors"
                >
                  <LinkIcon className="h-4 w-4" />
                  {user.website.replace(/^https?:\/\//, "")}
                </a>
              )}
              {user.github && (
                <a
                  href={`https://github.com/${user.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-orange-500 transition-colors"
                >
                  <Github className="h-4 w-4" />
                  {user.github}
                </a>
              )}
              {user.twitter && (
                <a
                  href={`https://twitter.com/${user.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-orange-500 transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                  {user.twitter}
                </a>
              )}
            </div>

            <div className="mt-4 flex items-center gap-6 justify-center sm:justify-start text-sm">
              <span className="flex items-center gap-1.5">
                <Package className="h-4 w-4 text-orange-500" />
                <strong>{user._count?.agents || 0}</strong> agents
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-orange-500" />
                <strong>{user._count?.stars || 0}</strong> stars
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-orange-500" />
                <strong>{followersCount}</strong> followers
              </span>
            </div>

            <div className="mt-4">
              <Button
                variant={following ? "outline" : "gradient"}
                onClick={handleToggleFollow}
              >
                {following ? (
                  <>
                    <UserMinus className="mr-2 h-4 w-4" />
                    Unfollow
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Follow
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Agent Grid */}
        <div className="mt-12">
          <h2 className="mb-6 text-xl font-semibold">Agents</h2>
          {agents.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {agents.map((agent) => (
                <Link key={agent.id} href={`/@${agent.publisher.username}/${agent.slug}`}>
                  <Card className="group h-full transition-all hover:border-orange-500/30 hover:shadow-lg">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                          {agent.name[0]}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-semibold group-hover:text-orange-500 transition-colors">
                            {agent.name}
                          </h3>
                          <p className="line-clamp-2 text-sm text-muted-foreground">
                            {agent.description}
                          </p>
                          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Download className="h-3 w-3" />
                              {formatNumber(agent.downloads)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              {formatNumber(agent.starsCount)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No published agents yet.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}