"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, Download, Rocket } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Find the perfect agent",
    description:
      "Search by category, browse trending agents, or check curated collections to find exactly what you need.",
    code: null,
  },
  {
    icon: Download,
    step: "02",
    title: "Install with one command",
    description:
      "Copy the install command and run it in your terminal. Every version is tracked and versioned.",
    code: "$ claude agent install anthropic/coder@1.2.0",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Build faster than ever",
    description:
      "The agent integrates directly into your Claude Code workflow. Customize, fork, and share improvements.",
    code: null,
  },
];

export function HowItWorksSection() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Get started in <span className="gradient-text">three steps</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From discovery to deployment in under a minute.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative"
            >
              {index < steps.length - 1 && (
                <div className="absolute right-0 top-12 hidden h-px w-full translate-x-1/2 bg-gradient-to-r from-orange-500/50 to-transparent lg:block" />
              )}
              <div className="relative rounded-xl border border-border/50 bg-card/50 p-8">
                <div className="mb-4 flex items-center gap-4">
                  <span className="text-sm font-bold text-orange-500">{step.step}</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                    <step.icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                {step.code && (
                  <div className="mt-4 rounded-lg bg-foreground/5 p-3 font-mono text-sm">
                    <span className="text-muted-foreground">$</span>{" "}
                    <span className="text-orange-500">claude agent install</span>{" "}
                    <span className="text-foreground">anthropic/coder@1.2.0</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}