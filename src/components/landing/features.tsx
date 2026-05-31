"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Search,
  Upload,
  Terminal,
  Shield,
  Star,
  GitFork,
  Package,
  BarChart3,
  Users,
  Layers,
  BookOpen,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Discover Agents",
    description: "Search and browse thousands of Claude Code subagents by category, tags, or popularity.",
  },
  {
    icon: Upload,
    title: "Publish Instantly",
    description: "Share your subagents with the world. One-click publishing with automatic validation.",
  },
  {
    icon: Terminal,
    title: "Install in Seconds",
    description: "One command to install any agent. Auto-generated install commands for every version.",
  },
  {
    icon: Shield,
    title: "Verified Publishers",
    description: "Trust indicators and verification badges ensure you install safe, quality agents.",
  },
  {
    icon: Star,
    title: "Rate & Review",
    description: "Community ratings and reviews help you find the best agents for your workflow.",
  },
  {
    icon: GitFork,
    title: "Fork & Improve",
    description: "Fork any public agent, customize it, and contribute improvements back to the community.",
  },
  {
    icon: Package,
    title: "Agent Bundles",
    description: "Package multiple agents into bundles for one-command setup of complete workflows.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track downloads, views, ratings, and growth trends for your published agents.",
  },
  {
    icon: Users,
    title: "Organizations",
    description: "Create teams, manage shared agents, and publish under your organization's brand.",
  },
  {
    icon: Layers,
    title: "Collections",
    description: "Curate and share lists of your favorite agents for specific use cases or stacks.",
  },
  {
    icon: BookOpen,
    title: "Documentation",
    description: "Rich README rendering, versioned docs, and examples for every agent.",
  },
  {
    icon: Zap,
    title: "Trending Rankings",
    description: "Algorithmically ranked trending agents based on downloads, stars, and growth.",
  },
];

export function FeaturesSection() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need for{" "}
            <span className="gradient-text">Claude Code agents</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A complete ecosystem for discovering, sharing, and managing subagents.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group rounded-xl border border-border/50 bg-card/50 p-6 transition-all hover:border-orange-500/30 hover:bg-card hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 transition-colors group-hover:bg-orange-500/20">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}