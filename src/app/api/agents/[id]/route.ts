import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const agent = await prisma.agent.findUnique({
      where: { id },
      include: {
        publisher: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            isVerified: true,
            bio: true,
          },
        },
        tags: { select: { tag: true } },
        versions: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        screenshots: { orderBy: { order: "asc" } },
        _count: {
          select: {
            reviews: true,
            forks: true,
            stars: true,
            downloadRecords: true,
          },
        },
      },
    });

    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: agent });
  } catch (error) {
    console.error("API /agents/[id] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch agent" },
      { status: 500 },
    );
  }
}