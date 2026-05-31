"use client";

import { Badge } from "@/components/ui/badge";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const categoryInfo = CATEGORIES.find((c) => c.value === category);

  return (
    <Badge variant="secondary" className={cn("gap-1", className)}>
      {categoryInfo?.icon && <span>{categoryInfo.icon}</span>}
      {categoryInfo?.label || category}
    </Badge>
  );
}