"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Terminal, Star, Download, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      {/* Background gradient effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-[120px]" />
        <div className="absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-amber-500/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-orange-600/5 blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-sm font-medium text-orange-500"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
            </span>
            Now in Public Beta
          </motion.div>

          <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            The{" "}
            <span className="gradient-text">npm for Claude Code</span>{" "}
            Subagents
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Discover, publish, and share subagents for Claude Code. Browse trending
            agents, install with one command, and build faster with the community.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/explore">
              <Button size="xl" variant="gradient" className="w-full sm:w-auto">
                Explore Agents
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/publish">
              <Button size="xl" variant="outline" className="w-full sm:w-auto">
                Publish Your Agent
              </Button>
            </Link>
          </div>

          {/* Install command */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 inline-flex items-center gap-3 rounded-xl border border-border/50 bg-card/80 px-5 py-3 font-mono text-sm shadow-lg backdrop-blur-sm"
          >
            <Terminal className="h-4 w-4 text-orange-500" />
            <span className="text-muted-foreground">$</span>
            <span className="text-foreground">claude agent install</span>
            <span className="text-orange-500">anthropic/coder</span>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 grid grid-cols-3 gap-8 sm:gap-16"
          >
            {[
              { icon: Download, value: "10K+", label: "Downloads" },
              { icon: Star, value: "500+", label: "Agents" },
              { icon: Users, value: "2K+", label: "Publishers" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2">
                <stat.icon className="h-5 w-5 text-orange-500" />
                <span className="text-2xl font-bold sm:text-3xl">{stat.value}</span>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}