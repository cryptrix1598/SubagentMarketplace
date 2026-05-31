"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";
import type { ActionResult } from "@/types";

export async function getNotifications(
  page: number = 1,
  pageSize: number = 20,
): Promise<ActionResult<any>> {
  try {
    const session = await requireAuth();

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.notification.count({ where: { userId: session.user.id } }),
    ]);

    return {
      success: true,
      data: { items: notifications, total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
    };
  } catch (error) {
    return { success: false, error: "Failed to fetch notifications", code: "INTERNAL" };
  }
}

export async function getUnreadCount(): Promise<ActionResult<number>> {
  try {
    const session = await requireAuth();

    const count = await prisma.notification.count({
      where: { userId: session.user.id, isRead: false },
    });

    return { success: true, data: count };
  } catch (error) {
    return { success: false, error: "Failed to fetch unread count", code: "INTERNAL" };
  }
}

export async function markNotificationRead(notificationId: string): Promise<ActionResult<any>> {
  try {
    const session = await requireAuth();

    await prisma.notification.update({
      where: { id: notificationId, userId: session.user.id },
      data: { isRead: true },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to mark notification", code: "INTERNAL" };
  }
}

export async function markAllNotificationsRead(): Promise<ActionResult<any>> {
  try {
    const session = await requireAuth();

    await prisma.notification.updateMany({
      where: { userId: session.user.id, isRead: false },
      data: { isRead: true },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to mark all notifications", code: "INTERNAL" };
  }
}