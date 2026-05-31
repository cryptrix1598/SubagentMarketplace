"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRelativeTime } from "@/lib/utils";
import { Shield, Eye } from "lucide-react";
import type { Report, User } from "@prisma/client";

interface ReportsTableProps {
  reports: Array<
    Report & {
      reporter: Pick<User, "id" | "username" | "displayName" | "avatarUrl">;
    }
  >;
  onResolve?: (reportId: string) => void;
}

export function ReportsTable({ reports, onResolve }: ReportsTableProps) {
  if (reports.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No pending reports
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Reporter</TableHead>
          <TableHead>Target</TableHead>
          <TableHead>Reason</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports.map((report) => (
          <TableRow key={report.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <span className="text-sm">{report.reporter.displayName}</span>
                <span className="text-xs text-muted-foreground">
                  @{report.reporter.username}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="text-xs">
                {report.targetType}
              </Badge>
            </TableCell>
            <TableCell className="max-w-[200px] truncate text-sm">
              {report.reason}
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  report.status === "PENDING"
                    ? "warning"
                    : report.status === "RESOLVED"
                      ? "success"
                      : "secondary"
                }
              >
                {report.status}
              </Badge>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {formatRelativeTime(report.createdAt)}
            </TableCell>
            <TableCell className="text-right">
              {report.status === "PENDING" && onResolve && (
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onResolve(report.id)}
                    title="Review"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onResolve(report.id)}
                    title="Resolve"
                  >
                    <Shield className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}