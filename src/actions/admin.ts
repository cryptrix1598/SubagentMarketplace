"use server";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import type { ActionResult } from "@/types";

export async function adminGetUsers(
  page: number = 1,
  pageSize: number = 50,
  search?: string,
): Promise<ActionResult<any>> {
  try {
    await requireAdmin();

    const where = search
      ? {
          OR: [
            { username: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { displayName: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          isVerified: true,
          isBanned: true,
          role: true,
          createdAt: true,
          _count: { select: { agents: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      success: true,
      data: { items: users, total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
    };
  } catch (error) {
    return { success: false, error: "Failed to fetch users", code: "INTERNAL" };
  }
}

export async function adminUpdateUserRole(
  userId: string,
  role: string,
): Promise<ActionResult<any>> {
  try {
    await requireAdmin();

    await prisma.user.update({
      where: { id: userId },
      data: { role: role as never },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update role", code: "INTERNAL" };
  }
}

export async function adminBanUser(userId: string): Promise<ActionResult<any>> {
  try {
    await requireAdmin();

    await prisma.user.update({
      where: { id: userId },
      data: { isBanned: true },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to ban user", code: "INTERNAL" };
  }
}

export async function adminUnbanUser(userId: string): Promise<ActionResult<any>> {
  try {
    await requireAdmin();

    await prisma.user.update({
      where: { id: userId },
      data: { isBanned: false },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to unban user", code: "INTERNAL" };
  }
}

export async function adminGetAgents(
  page: number = 1,
  pageSize: number = 50,
): Promise<ActionResult<any>> {
  try {
    await requireAdmin();

    const [agents, total] = await Promise.all([
      prisma.agent.findMany({
        include: {
          publisher: {
            select: { id: true, username: true, displayName: true, avatarUrl: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.agent.count(),
    ]);

    return {
      success: true,
      data: { items: agents, total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
    };
  } catch (error) {
    return { success: false, error: "Failed to fetch agents", code: "INTERNAL" };
  }
}

export async function adminFeatureAgent(agentId: string): Promise<ActionResult<any>> {
  try {
    await requireAdmin();

    await prisma.agent.update({
      where: { id: agentId },
      data: { isFeatured: true },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to feature agent", code: "INTERNAL" };
  }
}

export async function adminUnfeatureAgent(agentId: string): Promise<ActionResult<any>> {
  try {
    await requireAdmin();

    await prisma.agent.update({
      where: { id: agentId },
      data: { isFeatured: false },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to unfeature agent", code: "INTERNAL" };
  }
}

export async function adminVerifyAgent(agentId: string): Promise<ActionResult<any>> {
  try {
    await requireAdmin();

    await prisma.agent.update({
      where: { id: agentId },
      data: { isVerified: true },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to verify agent", code: "INTERNAL" };
  }
}

export async function adminGetReports(
  page: number = 1,
  pageSize: number = 50,
  status?: string,
): Promise<ActionResult<any>> {
  try {
    await requireAdmin();

    const where = status ? { status: status as never } : {};

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        include: {
          reporter: {
            select: { id: true, username: true, displayName: true, avatarUrl: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.report.count({ where }),
    ]);

    return {
      success: true,
      data: { items: reports, total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
    };
  } catch (error) {
    return { success: false, error: "Failed to fetch reports", code: "INTERNAL" };
  }
}

export async function adminResolveReport(
  reportId: string,
  action: "RESOLVED" | "DISMISSED",
): Promise<ActionResult<any>> {
  try {
    const session = await requireAdmin();

    await prisma.report.update({
      where: { id: reportId },
      data: {
        status: action as never,
        resolvedBy: session.user.id,
        resolvedAt: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to resolve report", code: "INTERNAL" };
  }
}

export async function adminDeleteAgent(agentId: string): Promise<ActionResult<any>> {
  try {
    await requireAdmin();

    await prisma.agent.delete({ where: { id: agentId } });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete agent", code: "INTERNAL" };
  }
}

export async function adminGetReviews(
  page: number = 1,
  pageSize: number = 50,
): Promise<ActionResult<any>> {
  try {
    await requireAdmin();

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        include: {
          user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
          agent: { select: { id: true, name: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.review.count(),
    ]);

    return {
      success: true,
      data: { items: reviews, total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
    };
  } catch (error) {
    return { success: false, error: "Failed to fetch reviews", code: "INTERNAL" };
  }
}

export async function adminDeleteReview(reviewId: string): Promise<ActionResult<any>> {
  try {
    await requireAdmin();

    await prisma.review.delete({ where: { id: reviewId } });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete review", code: "INTERNAL" };
  }
}

export async function createReport(
  targetId: string,
  targetType: string,
  reason: string,
  description?: string,
): Promise<ActionResult<any>> {
  try {
    const session = await requireAuth();

    await prisma.report.create({
      data: {
        reporterId: session.user.id,
        targetId,
        targetType: targetType as never,
        reason,
        description,
      },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to create report", code: "INTERNAL" };
  }
}

async function requireAuth() {
  const { requireAuth: ra } = await import("@/lib/auth-guard");
  return ra();
}