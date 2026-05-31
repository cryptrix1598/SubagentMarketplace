"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  Download,
  Star,
  Verified,
  X,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber, cn } from "@/lib/utils";
import { CATEGORIES, CATEGORY_LABELS, SORT_OPTIONS } from "@/lib/constants";
import { getAgents } from "@/actions/agent";
import type { AgentListItem, SearchFilters } from "@/types";
import type { Category } from "@/lib/constants";

export function ExplorePageClient() {
  const searchParams = useSearchParams();
  const [agents, setAgents] = useState<AgentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get("q") || "",
    sort: "trending",
    category: searchParams.get("cat") || undefined,
    verifiedOnly: false,
    page: 1,
    pageSize: 24,
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchAgents = useCallback(async (reset = false) => {
    setLoading(true);
    const currentPage = reset ? 1 : page;
    const result = await getAgents({ ...filters, page: currentPage });
    if (result.success && result.data) {
      if (reset) {
        setAgents(result.data.items);
      } else {
        setAgents((prev) => [...prev, ...result.data!.items]);
      }
      setTotal(result.data.total);
      setHasMore(currentPage < result.data.totalPages);
    }
    setLoading(false);
  }, [filters, page]);

  useEffect(() => {
    fetchAgents(true);
  }, [filters]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchAgents();
  };

  const updateFilter = (key: keyof SearchFilters, value: unknown) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Explore Agents</h1>
        <p className="mt-2 text-muted-foreground">
          {total > 0 ? `${total.toLocaleString()} agents available` : "Discover agents for your workflow"}
        </p>
      </div>

      {/* Search & Filters Bar */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.query || ""}
            onChange={(e) => updateFilter("query", e.target.value)}
            placeholder="Search agents, tags, publishers..."
            className="h-11 pl-10"
          />
          {filters.query && (
            <button
              onClick={() => updateFilter("query", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={filters.sort}
            onValueChange={(value) => updateFilter("sort", value)}
          >
            <SelectTrigger className="h-11 w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Extended Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-8 overflow-hidden"
          >
            <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border/50 bg-card/50 p-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Category:</span>
                <Select
                  value={filters.category || "all"}
                  onValueChange={(v) => updateFilter("category", v === "all" ? undefined : v)}
                >
                  <SelectTrigger className="h-9 w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Verified only:</span>
                <Switch
                  checked={filters.verifiedOnly}
                  onCheckedChange={(v) => updateFilter("verifiedOnly", v)}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filter Tags */}
      {(filters.category || filters.verifiedOnly) && (
        <div className="mb-4 flex flex-wrap gap-2">
          {filters.category && (
            <Badge variant="secondary" className="gap-1">
              {CATEGORY_LABELS[filters.category as Category] || filters.category}
              <button onClick={() => updateFilter("category", undefined)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.verifiedOnly && (
            <Badge variant="secondary" className="gap-1">
              Verified Only
              <button onClick={() => updateFilter("verifiedOnly", false)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Agent Grid */}
      {loading && agents.length === 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <Skeleton className="mb-3 h-12 w-12 rounded-xl" />
                <Skeleton className="mb-2 h-5 w-3/4" />
                <Skeleton className="mb-4 h-4 w-full" />
                <div className="flex gap-3">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : agents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Search className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold">No agents found</h3>
          <p className="mt-2 text-muted-foreground">
            Try adjusting your search or filters.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setFilters({ query: "", sort: "trending", page: 1, pageSize: 24 });
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                size="lg"
                onClick={loadMore}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function AgentCard({ agent }: { agent: AgentListItem }) {
  return (
    <Link href={`/@${agent.publisher.username}/${agent.slug}`}>
      <Card className="group h-full transition-all hover:border-orange-500/30 hover:shadow-lg">
        <CardContent className="p-5">
          <div className="mb-3 flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
              <span className="text-lg font-bold">{agent.name[0]}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate font-semibold group-hover:text-orange-500 transition-colors">
                  {agent.name}
                </h3>
                {agent.publisher.isVerified && (
                  <Verified className="h-4 w-4 shrink-0 text-orange-500" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                by {agent.publisher.displayName || agent.publisher.username}
              </p>
            </div>
          </div>

          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
            {agent.description}
          </p>

          <div className="mb-3 flex flex-wrap gap-1">
            {agent.tags.slice(0, 3).map((tag) => (
              <Badge key={tag.tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                {tag.tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {formatNumber(agent.downloads)}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              {formatNumber(agent.starsCount)}
            </span>
            <span className="ml-auto text-xs">
              v{agent.version}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
