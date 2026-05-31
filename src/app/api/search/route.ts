import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { searchSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type") || "agents";
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);

    if (!query.trim()) {
      return NextResponse.json({ data: [], query: "" });
    }

    const validated = searchSchema.safeParse({ query, type, limit });
    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid search parameters", details: validated.error.flatten() },
        { status: 400 },
      );
    }

    let data: unknown[] = [];

    if (type === "agents" || type === "all") {
      const agents = await prisma.agent.findMany({
        where: {
          isPublic: true,
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { slug: { contains: query, mode: "insensitive" } },
            { tags: { some: { tag: { contains: query, mode: "insensitive" } } } },
          ],
        },
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          category: true,
          downloads: true,
          starsCount: true,
          publisher: {
            select: { username: true, displayName: true, avatarUrl: true, isVerified: true },
          },
          tags: { select: { tag: true } },
        },
      });

      if (type === "agents") {
        data = agents;
      } else {
        data = agents.map((a) => ({ ...a, _type: "agent" }));
      }
    }

    if (type === "users" || type === "all") {
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: query, mode: "insensitive" } },
            { displayName: { contains: query, mode: "insensitive" } },
          ],
        },
        take: limit,
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          isVerified: true,
          bio: true,
          _count: { select: { agents: true, followers: true } },
        },
      });

      if (type === "users") {
        data = users;
      } else {
        data = [
          ...data,
          ...users.map((u) => ({ ...u, _type: "user" })),
        ];
      }
    }

    if (type === "collections" || type === "all") {
      const collections = await prisma.collection.findMany({
        where: {
          visibility: "PUBLIC",
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          user: {
            select: { username: true, displayName: true, avatarUrl: true },
          },
          _count: { select: { agents: true } },
        },
      });

      if (type === "collections") {
        data = collections;
      } else {
        data = [
          ...data,
          ...collections.map((c) => ({ ...c, _type: "collection" })),
        ];
      }
    }

    return NextResponse.json({ data, query });
  } catch (error) {
    console.error("API /search GET error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 },
    );
  }
}