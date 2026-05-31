import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const offset = (page - 1) * limit;

    const [collections, total] = await Promise.all([
      prisma.collection.findMany({
        where: { visibility: "PUBLIC" },
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
        include: {
          user: {
            select: { id: true, username: true, displayName: true, avatarUrl: true, isVerified: true },
          },
          _count: { select: { agents: true } },
        },
      }),
      prisma.collection.count({ where: { visibility: "PUBLIC" } }),
    ]);

    return NextResponse.json({
      data: collections,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("API /collections GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch collections" },
      { status: 500 },
    );
  }
}