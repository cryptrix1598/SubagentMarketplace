"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";
import { NotFoundError } from "@/lib/errors";
import type { ActionResult, DashboardStats } from "@/types";

export async function getPublisherDashboard(): Promise<ActionResult<DashboardStats>> {
  try {
    const session = await requireAuth();

    const agents = await prisma.agent.findMany({
      where: { publisherId: session.user.id },
      include: {
        publisher: {
          select: { id: true, username: true, displayName: true, avatarUrl: true, isVerified: true },
        },
        tags: true,
      },
      orderBy: { downloads: "desc" },
    });

    const totalDownloads = agents.reduce((sum, a) => sum + a.downloads, 0);
    const totalViews = agents.reduce((sum, a) => sum + a.views, 0);
    const totalStars = agents.reduce((sum, a) => sum + a.starsCount, 0);
    const weeklyDownloads = agents.reduce((sum, a) => sum + a.weeklyDownloads, 0);
    const monthlyDownloads = agents.reduce((sum, a) => sum + a.monthlyDownloads, 0);
    const averageRating =
      agents.length > 0
        ? agents.reduce((sum, a) => sum + a.averageRating, 0) / agents.length
        : 0;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentDownloads = await prisma.agentDownload.count({
      where: {
        agent: { publisherId: session.user.id },
        createdAt: { gte: thirtyDaysAgo },
      },
    });

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const previousPeriodDownloads = await prisma.agentDownload.count({
      where: {
        agent: { publisherId: session.user.id },
        createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
      },
    });

    const growthRate =
      previousPeriodDownloads > 0
        ? ((recentDownloads - previousPeriodDownloads) / previousPeriodDownloads) * 100
        : 0;

    const last30Days: { date: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0] ?? "";

      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const count = await prisma.agentDownload.count({
        where: {
          agent: { publisherId: session.user.id },
          createdAt: { gte: date, lt: nextDay },
        },
      });

      last30Days.push({ date: dateStr, count });
    }

    return {
      success: true,
      data: {
        totalAgents: agents.length,
        totalDownloads,
        totalViews,
        totalStars,
        weeklyDownloads,
        monthlyDownloads,
        averageRating,
        growthRate,
        downloadsByDay: last30Days,
        topAgents: agents.slice(0, 10),
      },
    };
  } catch (error) {
    return { success: false, error: "Failed to fetch dashboard", code: "INTERNAL" };
  }
}

export async function getAdminDashboard(): Promise<ActionResult<any>> {
  try {
    const session = await requireAuth();
    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return { success: false, error: "Admin access required", code: "FORBIDDEN" };
    }

    const [
      totalUsers,
      totalAgents,
      totalDownloadsResult,
      totalReviews,
      totalOrganizations,
      totalReports,
      pendingReports,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.agent.count(),
      prisma.agent.aggregate({ _sum: { downloads: true } }),
      prisma.review.count(),
      prisma.organization.count(),
      prisma.report.count(),
      prisma.report.count({ where: { status: "PENDING" } }),
    ]);

    const usersByRole = await prisma.user.groupBy({
      by: ["role"],
      _count: { role: true },
    });

    const agentsByCategory = await prisma.agent.groupBy({
      by: ["category"],
      _count: { category: true },
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [recentSignups, recentPublishedAgents] = await Promise.all([
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.agent.count({ where: { publishedAt: { gte: thirtyDaysAgo } } }),
    ]);

    return {
      success: true,
      data: {
        totalUsers,
        totalAgents,
        totalDownloads: totalDownloadsResult._sum.downloads || 0,
        totalReviews,
        totalOrganizations,
        totalReports,
        pendingReports,
        usersByRole: Object.fromEntries(usersByRole.map((r) => [r.role, r._count.role])),
        agentsByCategory: Object.fromEntries(agentsByCategory.map((c) => [c.category, c._count.category])),
        recentSignups,
        recentPublishedAgents,
      },
    };
  } catch (error) {
    return { success: false, error: "Failed to fetch admin dashboard", code: "INTERNAL" };
  }
}