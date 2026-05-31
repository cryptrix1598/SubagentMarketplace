"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "What is Claude Agent Hub?",
    answer:
      "Claude Agent Hub is the marketplace and package manager for Claude Code subagents. Think of it as npm for AI agents — you can discover, publish, install, and share subagents that extend Claude Code's capabilities.",
  },
  {
    question: "How do I install an agent?",
    answer:
      "Simply run `claude agent install publisher/agent` in your terminal. You can also specify a version with `@version`. Every agent page has a copyable install command.",
  },
  {
    question: "Is it free to use?",
    answer:
      "Yes! Browsing, searching, and installing agents is completely free. Publishing agents is also free. We offer premium features for organizations and teams in the future.",
  },
  {
    question: "How do I publish my own agent?",
    answer:
      "Sign up for a free account, then use our publishing wizard. You'll need to provide your agent's system prompt, configuration, and metadata. We validate everything automatically before publishing.",
  },
  {
    question: "What makes an agent 'verified'?",
    answer:
      "Verified agents are published by verified publishers who have gone through our identity verification process. This adds a trust indicator so users know the agent comes from a legitimate source.",
  },
  {
    question: "Can I fork and modify an agent?",
    answer:
      "Absolutely! You can fork any public agent, customize it for your needs, and even publish your fork. The fork graph tracks lineage so credit flows to original authors.",
  },
  {
    question: "How does versioning work?",
    answer:
      "Each agent supports semantic versioning (semver). You can publish multiple versions, and users can install specific versions or always get the latest. Version changelogs help users understand what changed.",
  },
  {
    question: "Is this open source?",
    answer:
      "Yes! Claude Agent Hub is open source under the MIT license. You can self-host your own instance, contribute to the project, or audit the codebase.",
  },
];

export function FAQSection() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently asked <span className="gradient-text">questions</span>
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-border/50 bg-card/50">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-5 text-left"
      >
        <span className="font-medium">{question}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}