import { NextRequest, NextResponse } from "next/server";
import type { AgentCategory, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const sort = searchParams.get("sort") || "trending";
    const category = searchParams.get("category") || "";
    const query = searchParams.get("q") || "";
    const tags = searchParams.get("tags")?.split(",").filter(Boolean) || [];

    const parsedLimit = Math.min(Math.max(limit, 1), 100);
    const offset = (page - 1) * parsedLimit;

    const where: Prisma.AgentWhereInput = { isPublic: true };

    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { slug: { contains: query, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = category.toUpperCase().replace("-", "_") as AgentCategory;
    }

    if (tags.length > 0) {
      where.tags = {
        some: {
          tag: { in: tags },
        },
      };
    }

    let orderBy: Prisma.AgentOrderByWithRelationInput;
    if (sort === "downloads") {
      orderBy = { downloads: "desc" };
    } else if (sort === "stars") {
      orderBy = { starsCount: "desc" };
    } else if (sort === "newest") {
      orderBy = { createdAt: "desc" };
    } else if (sort === "name") {
      orderBy = { name: "asc" };
    } else {
      orderBy = { trendingScore: "desc" };
    }

    const [agents, total] = await Promise.all([
      prisma.agent.findMany({
        where,
        orderBy,
        skip: offset,
        take: parsedLimit,
        include: {
          publisher: {
            select: { id: true, username: true, displayName: true, avatarUrl: true, isVerified: true },
          },
          tags: { select: { tag: true } },
          _count: { select: { reviews: true, forks: true } },
        },
      }),
      prisma.agent.count({ where }),
    ]);

    return NextResponse.json({
      data: agents,
      pagination: {
        page,
        limit: parsedLimit,
        total,
        totalPages: Math.ceil(total / parsedLimit),
      },
    });
  } catch (error) {
    console.error("API /agents GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch agents" },
      { status: 500 },
    );
  }
}
