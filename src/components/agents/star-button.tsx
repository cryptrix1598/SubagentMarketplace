"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleStar, checkStarred } from "@/actions/star";
import { formatNumber } from "@/lib/utils";

interface StarButtonProps {
  agentId: string;
  initialStarred: boolean;
  initialCount: number;
}

export function StarButton({ agentId, initialStarred, initialCount }: StarButtonProps) {
  const [starred, setStarred] = useState(initialStarred);
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const result = await toggleStar(agentId);
      if (result.data) {
        setStarred(result.data.starred);
        setCount((prev) => (result.data!.starred ? prev + 1 : prev - 1));
      }
    });
  };

  return (
    <Button
      variant={starred ? "default" : "outline"}
      size="sm"
      onClick={handleToggle}
      disabled={isPending}
      className="gap-1.5"
    >
      <Star
        className={`h-4 w-4 ${starred ? "fill-current" : ""}`}
      />
      <span>{starred ? "Starred" : "Star"}</span>
      <span className="ml-1 text-xs opacity-70">
        {formatNumber(count)}
      </span>
    </Button>
  );
}