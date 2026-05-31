"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, GitFork, MessageSquare, UserPlus, Bell, Package, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatRelativeTime, cn } from "@/lib/utils";
import { markAllNotificationsRead } from "@/actions/notification";
import { toast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const notificationIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  NEW_STAR: Star,
  NEW_REVIEW: MessageSquare,
  NEW_FOLLOWER: UserPlus,
  NEW_FORK: GitFork,
  AGENT_APPROVED: CheckCircle2,
  AGENT_REJECTED: Package,
  SYSTEM: Bell,
};

export function NotificationsPageClient({ notifications }: { notifications: Notification[] }) {
  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    toast({ title: "All notifications marked as read" });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="mt-2 text-muted-foreground">
            Stay up to date with activity on your agents and profile.
          </p>
        </div>
        {notifications.some((n) => !n.isRead) && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
            Mark all read
          </Button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification, index) => {
            const Icon = notificationIcons[notification.type] || Bell;
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card className={cn(!notification.isRead && "border-orange-500/30")}>
                  <CardContent className="flex items-start gap-4 p-4">
                    <div className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                      !notification.isRead ? "bg-orange-500/10 text-orange-500" : "bg-muted text-muted-foreground",
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className={cn("text-sm", !notification.isRead && "font-semibold")}>
                        {notification.title}
                      </p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{notification.message}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatRelativeTime(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="h-2 w-2 shrink-0 rounded-full bg-orange-500" />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Bell className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold">No notifications</h3>
          <p className="mt-2 text-muted-foreground">You&apos;re all caught up!</p>
        </div>
      )}
    </div>
  );
}