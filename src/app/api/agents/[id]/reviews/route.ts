import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const sort = searchParams.get("sort") || "newest";

    const parsedLimit = Math.min(Math.max(limit, 1), 100);
    const offset = (page - 1) * parsedLimit;

    const agent = await prisma.agent.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 },
      );
    }

    const orderBy =
      sort === "highest"
        ? { rating: "desc" as const }
        : sort === "lowest"
          ? { rating: "asc" as const }
          : { createdAt: "desc" as const };

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { agentId: id },
        orderBy,
        skip: offset,
        take: parsedLimit,
        include: {
          user: {
            select: { id: true, username: true, displayName: true, avatarUrl: true },
          },
        },
      }),
      prisma.review.count({ where: { agentId: id } }),
    ]);

    return NextResponse.json({
      data: reviews,
      pagination: {
        page,
        limit: parsedLimit,
        total,
        totalPages: Math.ceil(total / parsedLimit),
      },
    });
  } catch (error) {
    console.error("API /agents/[id]/reviews GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}