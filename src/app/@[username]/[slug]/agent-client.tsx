"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Download,
  Star,
  GitFork,
  Eye,
  Clock,
  CheckCircle2,
  Copy,
  Terminal,
  ExternalLink,
  Flag,
  ChevronDown,
  MessageSquare,
  History,
  Package,
  Shield,
  Verified,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { formatNumber, formatRelativeTime, cn } from "@/lib/utils";
import { generateInstallCommand } from "@/lib/install-commands";
import { toggleStar, checkStarred } from "@/actions/star";
import { createReview as submitReview } from "@/actions/review";
import type { AgentWithDetails } from "@/types";

interface AgentPageClientProps {
  agent: AgentWithDetails;
}

export function AgentPageClient({ agent }: AgentPageClientProps) {
  const [starred, setStarred] = useState(false);
  const [starCount, setStarCount] = useState(agent.starsCount);
  const [copied, setCopied] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  React.useEffect(() => {
    checkStarred(agent.id).then((res) => {
      if (res.success && res.data !== undefined) setStarred(res.data);
    });
  }, [agent.id]);

  const installCommand = generateInstallCommand(agent.publisher.username, agent.slug);

  const handleCopyCommand = async () => {
    await navigator.clipboard.writeText(installCommand);
    setCopied(true);
    toast({ title: "Copied!", description: "Install command copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleStar = async () => {
    const result = await toggleStar(agent.id);
    if (result.success && result.data) {
      setStarred(result.data.starred);
      setStarCount((prev) => prev + (result.data!.starred ? 1 : -1));
    }
  };

  const handleSubmitReview = async () => {
    if (reviewRating === 0) return;
    setReviewSubmitting(true);
    const result = await submitReview(agent.id, { rating: reviewRating, comment: reviewComment });
    if (result.success) {
      toast({ title: "Review submitted!", description: "Thank you for your feedback" });
      setReviewRating(0);
      setReviewComment("");
    }
    setReviewSubmitting(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
          <div className="flex-1">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{agent.category.toLowerCase().replace("_", "-")}</Badge>
              {agent.isVerified && (
                <Badge variant="default" className="gap-1">
                  <Verified className="h-3 w-3" />
                  Verified
                </Badge>
              )}
              {agent.isFeatured && <Badge variant="info">Featured</Badge>}
              <Badge variant="outline">v{agent.version}</Badge>
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{agent.name}</h1>

            <p className="mt-4 text-lg text-muted-foreground">{agent.description}</p>

            {agent.longDescription && (
              <p className="mt-2 text-muted-foreground">{agent.longDescription}</p>
            )}

            {/* Publisher */}
            <div className="mt-6 flex items-center gap-3">
              <Link href={`/@${agent.publisher.username}`}>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={agent.publisher.avatarUrl || ""} />
                  <AvatarFallback>
                    {(agent.publisher.displayName || agent.publisher.username)[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <Link
                  href={`/@${agent.publisher.username}`}
                  className="flex items-center gap-1 font-medium hover:text-orange-500 transition-colors"
                >
                  {agent.publisher.displayName || agent.publisher.username}
                  {agent.publisher.isVerified && <Verified className="h-4 w-4 text-orange-500" />}
                </Link>
                <p className="text-sm text-muted-foreground">@{agent.publisher.username}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Download className="h-4 w-4" />
                {formatNumber(agent.downloads)} downloads
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4" />
                {formatNumber(starCount)} stars
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                {formatNumber(agent.views)} views
              </span>
              <span className="flex items-center gap-1.5">
                <GitFork className="h-4 w-4" />
                {agent.forksCount} forks
              </span>
              <span className="flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4" />
                {agent.reviewsCount} reviews
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                Published {formatRelativeTime(agent.publishedAt || agent.createdAt)}
              </span>
            </div>

            {/* Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {agent.tags.map((tag) => (
                <Link key={tag.tag} href={`/explore?tag=${tag.tag}`}>
                  <Badge variant="outline" className="hover:bg-accent cursor-pointer">
                    {tag.tag}
                  </Badge>
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" variant="gradient" onClick={handleCopyCommand}>
                {copied ? <CheckCircle2 className="mr-2 h-5 w-5" /> : <Terminal className="mr-2 h-5 w-5" />}
                {copied ? "Copied!" : "Install Command"}
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={handleToggleStar}
                className={cn(starred && "border-orange-500/50 text-orange-500")}
              >
                <Star className={cn("mr-2 h-5 w-5", starred && "fill-orange-500")} />
                {starred ? "Starred" : "Star"}
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline">
                    <GitFork className="mr-2 h-5 w-5" />
                    Fork
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Fork {agent.name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Forking creates a copy of this agent under your account. You can then customize it freely.
                    </p>
                    <Button variant="gradient" className="w-full">
                      Create Fork
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Install Command Display */}
            <div className="mt-4 inline-flex items-center gap-3 rounded-xl border border-border/50 bg-card/80 px-4 py-2.5 font-mono text-sm">
              <Terminal className="h-4 w-4 text-orange-500" />
              <span className="text-muted-foreground">$</span>
              <span className="text-foreground">{installCommand}</span>
              <button
                onClick={handleCopyCommand}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Agent Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">License</span>
                  <span className="font-medium">{agent.license}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-medium">{agent.version}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <Badge variant="secondary">{agent.category.toLowerCase().replace("_", "-")}</Badge>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="flex items-center gap-1 font-medium">
                    <Star className="h-3 w-3 fill-orange-500 text-orange-500" />
                    {agent.averageRating.toFixed(1)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Published</span>
                  <span className="font-medium">{formatRelativeTime(agent.publishedAt || agent.createdAt)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated</span>
                  <span className="font-medium">{formatRelativeTime(agent.updatedAt)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Fork Info */}
            {agent.fork && (
              <Card className="mt-4">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">
                    Forked from{" "}
                    <Link
                      href={`/@${agent.fork.parentAgent.publisherId}/${agent.fork.parentAgent.slug}`}
                      className="font-medium text-orange-500 hover:underline"
                    >
                      {agent.fork.parentAgent.publisherId}/{agent.fork.parentAgent.slug}
                    </Link>
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Dependencies */}
            {agent.dependencies.length > 0 && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-base">Dependencies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {agent.dependencies.map((dep) => (
                    <Link
                      key={dep.dependencyId}
                      href={`/@${dep.dependency.publisherId}/${dep.dependency.slug}`}
                      className="flex items-center gap-2 text-sm hover:text-orange-500 transition-colors"
                    >
                      <Package className="h-3 w-3" />
                      {dep.dependency.name}
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </motion.div>

      {/* Tabs: README, Reviews, Versions */}
      <div className="mt-12">
        <Tabs defaultValue="readme">
          <TabsList>
            <TabsTrigger value="readme">README</TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews ({agent.reviewsCount})
            </TabsTrigger>
            <TabsTrigger value="versions">
              Versions ({agent.versions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="readme" className="mt-6">
            <Card>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none p-6">
                {agent.readme ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {agent.readme}
                  </ReactMarkdown>
                ) : (
                  <p className="text-muted-foreground">No README provided.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            {/* Write Review */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold">Write a Review</h3>
                <div className="mb-4 flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="text-2xl transition-colors"
                    >
                      <Star
                        className={cn(
                          "h-7 w-7",
                          star <= reviewRating
                            ? "fill-orange-500 text-orange-500"
                            : "text-muted-foreground/30",
                        )}
                      />
                    </button>
                  ))}
                </div>
                <Textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience with this agent..."
                  className="mb-4"
                />
                <Button
                  variant="gradient"
                  disabled={reviewRating === 0 || reviewSubmitting}
                  onClick={handleSubmitReview}
                >
                  {reviewSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </CardContent>
            </Card>

            {/* Reviews List */}
            <div className="space-y-4">
              {agent.reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={review.user.avatarUrl || ""} />
                        <AvatarFallback>
                          {(review.user.displayName || review.user.username)[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {review.user.displayName || review.user.username}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={cn(
                                  "h-3 w-3",
                                  star <= review.rating
                                    ? "fill-orange-500 text-orange-500"
                                    : "text-muted-foreground/30",
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatRelativeTime(review.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {review.comment && (
                      <p className="mt-3 text-sm text-muted-foreground">{review.comment}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="versions" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {agent.versions.map((version) => (
                    <div
                      key={version.id}
                      className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <Package className="h-4 w-4 text-orange-500" />
                        <div>
                          <p className="font-medium">v{version.version}</p>
                          {version.changelog && (
                            <p className="text-sm text-muted-foreground">{version.changelog}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{formatRelativeTime(version.createdAt)}</span>
                        {version.isLatest && <Badge variant="default">Latest</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
