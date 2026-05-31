"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";
import { NotFoundError, ConflictError } from "@/lib/errors";
import { sendNewFollowerEmail } from "@/server/email";
import type { ActionResult } from "@/types";

export async function toggleFollow(userId: string): Promise<ActionResult<{ following: boolean }>> {
  try {
    const session = await requireAuth();

    if (userId === session.user.id) {
      return { success: false, error: "You cannot follow yourself", code: "FORBIDDEN" };
    }

    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser) throw new NotFoundError("User", userId);

    const existing = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: session.user.id, followingId: userId } },
    });

    if (existing) {
      await prisma.follow.delete({ where: { id: existing.id } });
      return { success: true, data: { following: false } };
    }

    await prisma.follow.create({
      data: { followerId: session.user.id, followingId: userId },
    });

    sendNewFollowerEmail(
      targetUser.email,
      targetUser.displayName || targetUser.name || targetUser.username,
      session.user.displayName || session.user.name || "Someone",
    ).catch(() => {});

    return { success: true, data: { following: true } };
  } catch (error) {
    if (error instanceof NotFoundError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Failed to toggle follow", code: "INTERNAL" };
  }
}

export async function checkFollowing(userId: string): Promise<ActionResult<boolean>> {
  try {
    const session = await requireAuth().catch(() => null);
    if (!session) return { success: true, data: false };

    const follow = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: session.user.id, followingId: userId } },
    });

    return { success: true, data: !!follow };
  } catch (error) {
    return { success: false, error: "Failed to check follow status", code: "INTERNAL" };
  }
}

export async function getUserFollowers(
  userId: string,
  page: number = 1,
  pageSize: number = 24,
): Promise<ActionResult<any>> {
  try {
    const [follows, total] = await Promise.all([
      prisma.follow.findMany({
        where: { followingId: userId },
        include: {
          follower: {
            select: { id: true, username: true, displayName: true, avatarUrl: true, isVerified: true, bio: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.follow.count({ where: { followingId: userId } }),
    ]);

    return {
      success: true,
      data: {
        items: follows.map((f) => f.follower),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    return { success: false, error: "Failed to fetch followers", code: "INTERNAL" };
  }
}

export async function getUserFollowing(
  userId: string,
  page: number = 1,
  pageSize: number = 24,
): Promise<ActionResult<any>> {
  try {
    const [follows, total] = await Promise.all([
      prisma.follow.findMany({
        where: { followerId: userId },
        include: {
          following: {
            select: { id: true, username: true, displayName: true, avatarUrl: true, isVerified: true, bio: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.follow.count({ where: { followerId: userId } }),
    ]);

    return {
      success: true,
      data: {
        items: follows.map((f) => f.following),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    return { success: false, error: "Failed to fetch following", code: "INTERNAL" };
  }
}