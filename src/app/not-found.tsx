"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="mb-8 text-[120px] font-bold leading-none tracking-tighter text-gradient md:text-[160px]"
        >
          404
        </motion.div>

        <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
          Page Not Found
        </h1>

        <p className="mb-8 max-w-md text-lg text-muted-foreground">
          The agent you&apos;re looking for doesn&apos;t exist or has been moved
          to a different registry.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link href="/explore">
              <Search className="mr-2 h-4 w-4" />
              Explore Agents
            </Link>
          </Button>

          <Button asChild variant="ghost" size="lg" onClick={() => window.history.back()}>
            <button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </button>
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <p className="text-sm text-muted-foreground">
            Error code:{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
              NOT_FOUND
            </code>
          </p>
        </motion.div>
      </motion.div>

      <style jsx>{`
        .text-gradient {
          background: linear-gradient(
            135deg,
            hsl(var(--primary)) 0%,
            hsl(var(--primary) / 0.6) 50%,
            hsl(var(--muted-foreground)) 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </div>
  );
}