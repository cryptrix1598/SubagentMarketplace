"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";
import { NotFoundError } from "@/lib/errors";
import type { ActionResult } from "@/types";

export async function toggleStar(agentId: string): Promise<ActionResult<{ starred: boolean }>> {
  try {
    const session = await requireAuth();
    const agent = await prisma.agent.findUnique({ where: { id: agentId } });

    if (!agent) throw new NotFoundError("Agent", agentId);

    const existing = await prisma.star.findUnique({
      where: { agentId_userId: { agentId, userId: session.user.id } },
    });

    if (existing) {
      await prisma.$transaction(async (tx) => {
        await tx.star.delete({ where: { id: existing.id } });
        await tx.agent.update({
          where: { id: agentId },
          data: { starsCount: { decrement: 1 } },
        });
      });

      return { success: true, data: { starred: false } };
    }

    await prisma.$transaction(async (tx) => {
      await tx.star.create({
        data: { agentId, userId: session.user.id },
      });
      await tx.agent.update({
        where: { id: agentId },
        data: { starsCount: { increment: 1 } },
      });

      await tx.notification.create({
        data: {
          userId: agent.publisherId,
          type: "NEW_STAR",
          title: "New star!",
          message: `${session.user.displayName || session.user.name} starred your agent "${agent.name}"`,
          data: { agentId, starredBy: session.user.id },
        },
      });
    });

    return { success: true, data: { starred: true } };
  } catch (error) {
    if (error instanceof NotFoundError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Failed to toggle star", code: "INTERNAL" };
  }
}

export async function checkStarred(agentId: string): Promise<ActionResult<boolean>> {
  try {
    const session = await requireAuth().catch(() => null);
    if (!session) return { success: true, data: false };

    const star = await prisma.star.findUnique({
      where: { agentId_userId: { agentId, userId: session.user.id } },
    });

    return { success: true, data: !!star };
  } catch (error) {
    return { success: false, error: "Failed to check star status", code: "INTERNAL" };
  }
}

export async function getUserStarredAgents(
  userId: string,
  page: number = 1,
  pageSize: number = 24,
): Promise<ActionResult<any>> {
  try {
    const [stars, total] = await Promise.all([
      prisma.star.findMany({
        where: { userId },
        include: {
          agent: {
            include: {
              publisher: {
                select: { id: true, username: true, displayName: true, avatarUrl: true, isVerified: true },
              },
              tags: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.star.count({ where: { userId } }),
    ]);

    return {
      success: true,
      data: {
        items: stars.map((s) => s.agent),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    return { success: false, error: "Failed to fetch starred agents", code: "INTERNAL" };
  }
}