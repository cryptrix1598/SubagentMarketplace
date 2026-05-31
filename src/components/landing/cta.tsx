"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Github, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CTASection() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 via-transparent to-amber-500/10 p-12 text-center"
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-[100px]" />
          </div>

          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to supercharge your{" "}
              <span className="gradient-text">Claude Code</span>?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of developers building with the agent ecosystem.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/signup">
                <Button size="xl" variant="gradient">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a
                href="https://github.com/claude-agent-hub"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="xl" variant="outline">
                  <Github className="mr-2 h-5 w-5" />
                  Star on GitHub
                </Button>
              </a>
            </div>

            <div className="mt-8 flex max-w-md flex-col items-center gap-2 sm:flex-row mx-auto">
              <Input
                type="email"
                placeholder="Enter your email for updates"
                className="rounded-lg border-border/50 bg-card/80 backdrop-blur-sm"
              />
              <Button variant="gradient" className="shrink-0">
                <Mail className="mr-2 h-4 w-4" />
                Subscribe
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              No spam. Unsubscribe at any time.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}