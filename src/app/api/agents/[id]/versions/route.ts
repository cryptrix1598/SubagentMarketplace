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
      select: { id: true },
    });

    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 },
      );
    }

    const versions = await prisma.agentVersion.findMany({
      where: { agentId: id },
      orderBy: { createdAt: "desc" },
      include: {
        files: {
          select: { id: true, path: true, fileType: true, size: true },
        },
      },
    });

    return NextResponse.json({ data: versions });
  } catch (error) {
    console.error("API /agents/[id]/versions GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch versions" },
      { status: 500 },
    );
  }
}