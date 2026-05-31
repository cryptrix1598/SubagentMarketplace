import { NextRequest, NextResponse } from "next/server";
import type { AgentCategory, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
    const category = searchParams.get("category") || "";

    const where: Prisma.AgentWhereInput = { isPublic: true };

    if (category) {
      where.category = category.toUpperCase().replace("-", "_") as AgentCategory;
    }

    const trending = await prisma.agent.findMany({
      where,
      orderBy: { trendingScore: "desc" },
      take: limit,
      include: {
        publisher: {
          select: { id: true, username: true, displayName: true, avatarUrl: true, isVerified: true },
        },
        tags: { select: { tag: true } },
        _count: { select: { reviews: true, forks: true } },
      },
    });

    return NextResponse.json({ data: trending });
  } catch (error) {
    console.error("API /trending GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending agents" },
      { status: 500 },
    );
  }
}
