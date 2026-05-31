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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRelativeTime } from "@/lib/utils";
import { Shield, Ban, CheckCircle2 } from "lucide-react";
import type { User } from "@prisma/client";

interface UsersTableProps {
  users: Array<
    Pick<User, "id" | "username" | "displayName" | "avatarUrl" | "email" | "role" | "isVerified" | "isBanned" | "createdAt">
  >;
  onBan?: (userId: string) => void;
  onUnban?: (userId: string) => void;
  onVerify?: (userId: string) => void;
  onRoleChange?: (userId: string, role: string) => void;
}

export function UsersTable({
  users,
  onBan,
  onUnban,
  onVerify,
  onRoleChange,
}: UsersTableProps) {
  if (users.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No users found
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatarUrl || undefined} alt={user.displayName || undefined} />
                  <AvatarFallback className="text-xs">
                    {user.displayName?.slice(0, 2).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium">{user.displayName}</span>
                    {user.isVerified && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
                  </div>
                  <span className="text-xs text-muted-foreground">@{user.username}</span>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="text-xs">
                {user.role}
              </Badge>
            </TableCell>
            <TableCell>
              {user.isBanned ? (
                <Badge variant="destructive" className="text-xs">
                  Banned
                </Badge>
              ) : (
                <Badge variant="success" className="text-xs">
                  Active
                </Badge>
              )}
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {formatRelativeTime(user.createdAt)}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                {!user.isVerified && onVerify && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onVerify(user.id)}
                    title="Verify user"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                )}
                {user.isBanned ? (
                  onUnban && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onUnban(user.id)}
                      title="Unban user"
                    >
                      <Shield className="h-4 w-4 text-green-600" />
                    </Button>
                  )
                ) : (
                  onBan && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onBan(user.id)}
                      title="Ban user"
                    >
                      <Ban className="h-4 w-4 text-destructive" />
                    </Button>
                  )
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}