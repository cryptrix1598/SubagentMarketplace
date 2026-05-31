"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";

interface DownloadsChartProps {
  data: Array<{ date: string; downloads: number }>;
}

export function DownloadsChart({ data }: DownloadsChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Downloads Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center text-muted-foreground">
            No download data yet
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxDownloads = Math.max(...data.map((d) => d.downloads), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Downloads Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-[200px] items-end gap-1">
          {data.map((entry, i) => {
            const height = maxDownloads > 0 ? (entry.downloads / maxDownloads) * 100 : 0;
            return (
              <div
                key={i}
                className="group relative flex flex-1 flex-col items-center justify-end"
              >
                <div className="absolute -top-8 hidden rounded bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md group-hover:block">
                  {formatNumber(entry.downloads)}
                </div>
                <div
                  className="w-full rounded-t bg-primary/80 transition-all hover:bg-primary"
                  style={{ height: `${Math.max(height, 2)}%` }}
                />
                {data.length <= 14 && (
                  <span className="mt-1 text-[10px] text-muted-foreground">
                    {new Date(entry.date).getDate()}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}