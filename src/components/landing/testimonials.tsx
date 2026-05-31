"use client";

import React from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Senior Engineer at Vercel",
    avatar: null,
    initials: "SC",
    quote:
      "AgentHub transformed how our team uses Claude Code. We went from writing prompts from scratch to installing battle-tested agents in seconds.",
  },
  {
    name: "Marcus Rivera",
    role: "Staff Engineer at Stripe",
    avatar: null,
    initials: "MR",
    quote:
      "The bundle feature is incredible. I can set up a complete dev workflow for new team members with a single command. Game changer.",
  },
  {
    name: "Aisha Patel",
    role: "Engineering Lead at Linear",
    avatar: null,
    initials: "AP",
    quote:
      "Publishing our internal agents to AgentHub saved us weeks. The validation and versioning system is exactly what we needed.",
  },
  {
    name: "James Kim",
    role: "CTO at Raycast",
    avatar: null,
    initials: "JK",
    quote:
      "Finally, a proper package manager for AI agents. The search is fast, the install is simple, and the community is growing fast.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by <span className="gradient-text">developers</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Teams around the world use AgentHub to ship faster with Claude Code.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-xl border border-border/50 bg-card/50 p-6"
            >
              <p className="text-sm leading-relaxed text-muted-foreground">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={testimonial.avatar || ""} />
                  <AvatarFallback className="bg-orange-500/10 text-orange-500 text-xs">
                    {testimonial.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}