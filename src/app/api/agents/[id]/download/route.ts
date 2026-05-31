import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const agent = await prisma.agent.findUnique({
      where: { id },
      select: { id: true, slug: true, publisherId: true, isPublic: true },
    });

    if (!agent || !agent.isPublic) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 },
      );
    }

    await prisma.agentDownload.create({
      data: { agentId: id },
    });

    await prisma.agent.update({
      where: { id },
      data: { downloads: { increment: 1 } },
    });

    return NextResponse.json({
      message: "Download recorded",
      installCommand: `claude agent install @${agent.publisherId}/${agent.slug}`,
    });
  } catch (error) {
    console.error("API /agents/[id]/download POST error:", error);
    return NextResponse.json(
      { error: "Failed to record download" },
      { status: 500 },
    );
  }
}