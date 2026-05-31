"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for individual developers getting started.",
    features: [
      "Browse & search all agents",
      "Install unlimited agents",
      "Publish up to 5 agents",
      "Community support",
      "Basic analytics",
    ],
    cta: "Get Started",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    description: "For power users and active publishers.",
    features: [
      "Everything in Free",
      "Unlimited agent publishing",
      "Advanced analytics dashboard",
      "Verified publisher badge",
      "Priority support",
      "Custom agent domains",
    ],
    cta: "Start Free Trial",
    variant: "gradient" as const,
    popular: true,
  },
  {
    name: "Team",
    price: "$29",
    period: "/month",
    description: "For teams and organizations building together.",
    features: [
      "Everything in Pro",
      "Organization management",
      "Team member roles",
      "Shared agent registry",
      "Audit logging",
      "SSO integration",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    variant: "outline" as const,
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent <span className="gradient-text">pricing</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start for free. Upgrade when you need more.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-xl border p-8 ${
                plan.popular
                  ? "border-orange-500/50 bg-card shadow-lg glow"
                  : "border-border/50 bg-card/50"
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2" variant="default">
                  Most Popular
                </Badge>
              )}
              <div>
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 shrink-0 text-orange-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button className="mt-8 w-full" variant={plan.variant} size="lg">
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}