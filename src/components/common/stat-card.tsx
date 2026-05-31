"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ title, value, change, icon, className }: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <p className="text-2xl font-bold">{value}</p>
          {change !== undefined && (
            <span
              className={cn(
                "flex items-center text-xs font-medium",
                isPositive ? "text-green-600" : "text-red-600",
              )}
            >
              {isPositive ? (
                <TrendingUp className="mr-0.5 h-3 w-3" />
              ) : (
                <TrendingDown className="mr-0.5 h-3 w-3" />
              )}
              {isPositive ? "+" : ""}
              {change.toFixed(1)}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}