import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    const { username } = await params;

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        website: true,
        location: true,
        isVerified: true,
        createdAt: true,
        _count: {
          select: {
            agents: true,
            followers: true,
            follows: true,
            reviews: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: user });
  } catch (error) {
    console.error("API /users/[username] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}