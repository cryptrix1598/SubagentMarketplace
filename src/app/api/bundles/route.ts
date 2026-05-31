import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const offset = (page - 1) * limit;

    const [bundles, total] = await Promise.all([
      prisma.bundle.findMany({
        where: { isPublic: true },
        orderBy: { downloads: "desc" },
        skip: offset,
        take: limit,
        include: {
          user: {
            select: { id: true, username: true, displayName: true, avatarUrl: true, isVerified: true },
          },
          agents: {
            include: {
              agent: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  publisher: { select: { username: true } },
                },
              },
            },
          },
          _count: { select: { agents: true } },
        },
      }),
      prisma.bundle.count({ where: { isPublic: true } }),
    ]);

    return NextResponse.json({
      data: bundles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("API /bundles GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bundles" },
      { status: 500 },
    );
  }
}