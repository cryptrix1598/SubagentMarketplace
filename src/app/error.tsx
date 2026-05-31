"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
        </div>

        <h1 className="mb-2 text-2xl font-bold tracking-tight">
          Something went wrong
        </h1>

        <p className="mb-8 max-w-md text-muted-foreground">
          An unexpected error occurred. This has been logged and our team will
          investigate. You can try again or go back to the home page.
        </p>

        {error.digest && (
          <p className="mb-4 text-sm text-muted-foreground">
            Error ID:{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
              {error.digest}
            </code>
          </p>
        )}

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} size="lg">
            <RotateCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>

          <Button asChild variant="outline" size="lg">
          <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}