import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CATEGORIES } from "@/lib/constants";

export async function GET() {
  try {
    const categoryCounts = await prisma.agent.groupBy({
      by: ["category"],
      where: { isPublic: true },
      _count: { category: true },
    });

    const countMap = new Map(
      categoryCounts.map((c) => [c.category, c._count.category]),
    );

    const categories = CATEGORIES.map((cat) => ({
      ...cat,
      count: countMap.get(cat.value.toUpperCase().replace("-", "_") as any) || 0,
    }));

    return NextResponse.json({ data: categories });
  } catch (error) {
    console.error("API /categories GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}