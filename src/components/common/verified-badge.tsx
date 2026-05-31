"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerifiedBadgeProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function VerifiedBadge({ className, size = "sm", showLabel = false }: VerifiedBadgeProps) {
  const iconSize =
    size === "lg" ? "h-5 w-5" : size === "md" ? "h-4 w-4" : "h-3 w-3";

  return showLabel ? (
    <Badge variant="success" className={cn("gap-1", className)}>
      <CheckCircle2 className={iconSize} />
      Verified
    </Badge>
  ) : (
    <span className={cn("inline-flex text-primary", className)} title="Verified">
      <CheckCircle2 className={iconSize} />
    </span>
  );
}