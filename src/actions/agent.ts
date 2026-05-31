"use server";

import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { requireAuth, requireVerified } from "@/lib/auth-guard";
import { agentPublishSchema, agentVersionSchema } from "@/lib/validations";
import { NotFoundError, ForbiddenError, ConflictError, ValidationError } from "@/lib/errors";
import { calculateTrendingScore, calculateGrowthRate, calculateEngagement } from "@/lib/trending";
import { generateAgentFileKey } from "@/server/storage";
import { trackAgentPublish, trackAgentView } from "@/server/analytics";
import { publishRateLimit } from "@/server/rate-limit";
import type { ActionResult, AgentListItem, AgentWithDetails, PaginatedResponse, SearchFilters } from "@/types";

export async function publishAgent(
  formData: unknown,
): Promise<ActionResult<{ id: string; slug: string }>> {
  try {
    const session = await requireVerified();
    const rateLimitResult = publishRateLimit(session.user.id);
    if (!rateLimitResult.allowed) {
      return { success: false, error: "Rate limit exceeded. Try again later.", code: "RATE_LIMIT" };
    }

    const validated = agentPublishSchema.parse(formData);

    const existing = await prisma.agent.findUnique({
      where: { publisherId_slug: { publisherId: session.user.id, slug: validated.slug } },
    });

    if (existing) {
      throw new ConflictError(`Agent with slug '${validated.slug}' already exists`);
    }

    const agent = await prisma.agent.create({
      data: {
        name: validated.name,
        slug: validated.slug,
        description: validated.description,
        longDescription: validated.longDescription,
        category: validated.category.toUpperCase().replace("-", "_") as never,
        license: validated.license,
        version: validated.version,
        readme: validated.readme,
        installationInstructions: validated.installationInstructions,
        isPublic: validated.isPublic,
        publisherId: session.user.id,
        publishedAt: new Date(),
        tags: {
          create: validated.tags.map((tag) => ({ tag })),
        },
        versions: {
          create: {
            version: validated.version,
            changelog: "Initial release",
            isLatest: true,
          },
        },
      },
    });

    await trackAgentPublish(session.user.id, agent.id, agent.name);

    return { success: true, data: { id: agent.id, slug: agent.slug } };
  } catch (error) {
    if (error instanceof ConflictError || error instanceof ValidationError) {
      return { success: false, error: error.message, code: error.code };
    }
    if (error instanceof Error && error.name === "ZodError") {
      return { success: false, error: "Invalid input data", code: "VALIDATION" };
    }
    return { success: false, error: "Failed to publish agent", code: "INTERNAL" };
  }
}

export async function updateAgent(
  agentId: string,
  formData: unknown,
): Promise<ActionResult<any>> {
  try {
    const session = await requireAuth();
    const agent = await prisma.agent.findUnique({ where: { id: agentId } });

    if (!agent) throw new NotFoundError("Agent", agentId);
    if (agent.publisherId !== session.user.id) throw new ForbiddenError("You can only edit your own agents");

    const validated = agentPublishSchema.partial().parse(formData);

    await prisma.agent.update({
      where: { id: agentId },
      data: {
        ...(validated.name && { name: validated.name }),
        ...(validated.description && { description: validated.description }),
        ...(validated.longDescription !== undefined && { longDescription: validated.longDescription }),
        ...(validated.category && { category: validated.category.toUpperCase().replace("-", "_") as never }),
        ...(validated.license && { license: validated.license }),
        ...(validated.readme !== undefined && { readme: validated.readme }),
        ...(validated.installationInstructions !== undefined && {
          installationInstructions: validated.installationInstructions,
        }),
        ...(validated.isPublic !== undefined && { isPublic: validated.isPublic }),
      },
    });

    if (validated.tags) {
      await prisma.agentTag.deleteMany({ where: { agentId } });
      await prisma.agentTag.createMany({
        data: validated.tags.map((tag) => ({ agentId, tag })),
      });
    }

    return { success: true };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Failed to update agent", code: "INTERNAL" };
  }
}

export async function publishAgentVersion(
  agentId: string,
  formData: unknown,
): Promise<ActionResult<{ version: string }>> {
  try {
    const session = await requireAuth();
    const agent = await prisma.agent.findUnique({ where: { id: agentId } });

    if (!agent) throw new NotFoundError("Agent", agentId);
    if (agent.publisherId !== session.user.id) throw new ForbiddenError();

    const validated = agentVersionSchema.parse(formData);

    const existingVersion = await prisma.agentVersion.findUnique({
      where: { agentId_version: { agentId, version: validated.version } },
    });

    if (existingVersion) {
      throw new ConflictError(`Version ${validated.version} already exists`);
    }

    await prisma.$transaction(async (tx) => {
      await tx.agentVersion.updateMany({
        where: { agentId, isLatest: true },
        data: { isLatest: false },
      });

      await tx.agentVersion.create({
        data: {
          agentId,
          version: validated.version,
          changelog: validated.changelog,
          isLatest: true,
        },
      });

      await tx.agent.update({
        where: { id: agentId },
        data: { version: validated.version, updatedAt: new Date() },
      });
    });

    return { success: true, data: { version: validated.version } };
  } catch (error) {
    if (error instanceof ConflictError || error instanceof ForbiddenError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Failed to publish version", code: "INTERNAL" };
  }
}

export async function getAgent(slug: string, publisherUsername: string): Promise<ActionResult<AgentWithDetails>> {
  try {
    const agent = await prisma.agent.findFirst({
      where: {
        slug,
        publisher: { username: publisherUsername },
        isPublic: true,
      },
      include: {
        publisher: {
          select: { id: true, username: true, displayName: true, avatarUrl: true, isVerified: true },
        },
        tags: true,
        versions: { orderBy: { createdAt: "desc" } },
        screenshots: { orderBy: { order: "asc" } },
        reviews: {
          take: 20,
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
          },
        },
        dependencies: {
          include: { dependency: { include: { publisher: { select: { username: true } } } } },
        },
        dependents: {
          include: { agent: { include: { publisher: { select: { username: true } } } } },
        },
        parentFork: {
          include: { parentAgent: { include: { publisher: { select: { username: true } } } } },
        },
        _count: { select: { stars: true, reviews: true, forks: true } },
      },
    });

    if (!agent) throw new NotFoundError("Agent");

    await prisma.agent.update({
      where: { id: agent.id },
      data: { views: { increment: 1 } },
    });

    return { success: true, data: agent as AgentWithDetails };
  } catch (error) {
    if (error instanceof NotFoundError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Failed to fetch agent", code: "INTERNAL" };
  }
}

export async function getAgents(
  filters: SearchFilters,
): Promise<ActionResult<PaginatedResponse<AgentListItem>>> {
  try {
    const {
      query,
      category,
      tags,
      sort = "trending",
      page = 1,
      pageSize = 24,
      verifiedOnly = false,
      publisherId,
    } = filters;

    const where: Prisma.AgentWhereInput = {
      publishedAt: { not: null },
    };

    if (category) {
    where["category"] = category.toUpperCase().replace("-", "_") as any;
    }

    if (tags && tags.length > 0) {
      where["tags"] = { some: { tag: { in: tags } } };
    }

    if (verifiedOnly) {
      where["isVerified"] = true;
    }

    if (publisherId) {
      where["publisherId"] = publisherId;
    }

    if (query) {
      where["OR"] = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { slug: { contains: query, mode: "insensitive" } },
        { tags: { some: { tag: { contains: query, mode: "insensitive" } } } },
      ];
    }

    const orderBy: Record<string, string> = {};
    switch (sort) {
      case "trending":
        orderBy["trendingScore"] = "desc";
        break;
      case "newest":
        orderBy["createdAt"] = "desc";
        break;
      case "popular":
        orderBy["views"] = "desc";
        break;
      case "most-downloaded":
        orderBy["downloads"] = "desc";
        break;
      case "most-starred":
        orderBy["starsCount"] = "desc";
        break;
      case "recently-updated":
        orderBy["updatedAt"] = "desc";
        break;
      default:
        orderBy["trendingScore"] = "desc";
    }

    const [items, total] = await Promise.all([
      prisma.agent.findMany({
        where,
        include: {
          publisher: {
            select: { id: true, username: true, displayName: true, avatarUrl: true, isVerified: true },
          },
          tags: true,
        },
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.agent.count({ where }),
    ]);

    return {
      success: true,
      data: {
        items: items as AgentListItem[],
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    return { success: false, error: "Failed to fetch agents", code: "INTERNAL" };
  }
}

export async function getTrendingAgents(limit: number = 12): Promise<ActionResult<AgentListItem[]>> {
  try {
    const agents = await prisma.agent.findMany({
      where: { isPublic: true, publishedAt: { not: null } },
      include: {
        publisher: {
          select: { id: true, username: true, displayName: true, avatarUrl: true, isVerified: true },
        },
        tags: true,
      },
      orderBy: { trendingScore: "desc" },
      take: limit,
    });

    return { success: true, data: agents as AgentListItem[] };
  } catch (error) {
    return { success: false, error: "Failed to fetch trending agents", code: "INTERNAL" };
  }
}

export async function getFeaturedAgents(limit: number = 6): Promise<ActionResult<AgentListItem[]>> {
  try {
    const agents = await prisma.agent.findMany({
      where: { isPublic: true, isFeatured: true, publishedAt: { not: null } },
      include: {
        publisher: {
          select: { id: true, username: true, displayName: true, avatarUrl: true, isVerified: true },
        },
        tags: true,
      },
      orderBy: { trendingScore: "desc" },
      take: limit,
    });

    return { success: true, data: agents as AgentListItem[] };
  } catch (error) {
    return { success: false, error: "Failed to fetch featured agents", code: "INTERNAL" };
  }
}

export async function deleteAgent(agentId: string): Promise<ActionResult<any>> {
  try {
    const session = await requireAuth();
    const agent = await prisma.agent.findUnique({ where: { id: agentId } });

    if (!agent) throw new NotFoundError("Agent", agentId);
    if (agent.publisherId !== session.user.id && session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      throw new ForbiddenError();
    }

    await prisma.agent.delete({ where: { id: agentId } });
    return { success: true };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Failed to delete agent", code: "INTERNAL" };
  }
}

export async function recordDownload(
  agentId: string,
  versionId?: string,
): Promise<ActionResult<any>> {
  try {
    const session = await requireAuth().catch(() => null);

    await prisma.$transaction(async (tx) => {
      await tx.agentDownload.create({
        data: {
          agentId,
          versionId,
          userId: session?.user.id,
        },
      });

      await tx.agent.update({
        where: { id: agentId },
        data: { downloads: { increment: 1 } },
      });

      if (versionId) {
        await tx.agentVersion.update({
          where: { id: versionId },
          data: { downloads: { increment: 1 } },
        });
      }
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to record download", code: "INTERNAL" };
  }
}

export async function updateTrendingScores(): Promise<ActionResult<any>> {
  try {
    const agents = await prisma.agent.findMany({
      where: { isPublic: true },
      include: {
        _count: { select: { stars: true, reviews: true } },
      },
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    for (const agent of agents) {
      const recentDownloads = await prisma.agentDownload.count({
        where: {
          agentId: agent.id,
          createdAt: { gte: thirtyDaysAgo },
        },
      });

      const previousMonthlyDownloads = agent.monthlyDownloads;
      const growthRate = calculateGrowthRate(recentDownloads, previousMonthlyDownloads);
      const engagement = calculateEngagement(
        agent.views,
        agent.downloads,
        agent.starsCount,
        agent.reviewsCount,
      );

      const trendingScore = calculateTrendingScore({
        downloads: agent.downloads,
        recentDownloads,
        stars: agent.starsCount,
        growthRate,
        engagement,
      });

      await prisma.agent.update({
        where: { id: agent.id },
        data: {
          trendingScore,
          weeklyDownloads: Math.floor(recentDownloads / 4.3),
          monthlyDownloads: recentDownloads,
        },
      });
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update trending scores", code: "INTERNAL" };
  }
}

export async function getAgentVersions(agentId: string): Promise<ActionResult<any>> {
  try {
    const versions = await prisma.agentVersion.findMany({
      where: { agentId },
      orderBy: { createdAt: "desc" },
      include: { files: true },
    });

    return { success: true, data: versions };
  } catch (error) {
    return { success: false, error: "Failed to fetch versions", code: "INTERNAL" };
  }
}

export async function uploadAgentFile(
  agentId: string,
  versionId: string,
  filePath: string,
  content: string,
  fileType: string,
): Promise<ActionResult<any>> {
  try {
    const session = await requireAuth();
    const agent = await prisma.agent.findUnique({ where: { id: agentId } });

    if (!agent) throw new NotFoundError("Agent", agentId);
    if (agent.publisherId !== session.user.id) throw new ForbiddenError();

    const size = Buffer.byteLength(content, "utf-8");

    const file = await prisma.agentFile.upsert({
      where: { versionId_path: { versionId, path: filePath } },
      create: {
        versionId,
        agentId,
        path: filePath,
        content,
        fileType: fileType as never,
        size,
      },
      update: {
        content,
        fileType: fileType as never,
        size,
      },
    });

    return { success: true, data: file };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Failed to upload file", code: "INTERNAL" };
  }
}

export async function getAgentsByCategory(): Promise<ActionResult<Record<string, AgentListItem[]>>> {
  try {
    const categories = await prisma.agent.findMany({
      where: { isPublic: true, publishedAt: { not: null } },
      include: {
        publisher: {
          select: { id: true, username: true, displayName: true, avatarUrl: true, isVerified: true },
        },
        tags: true,
      },
      orderBy: { trendingScore: "desc" },
    });

    const grouped: Record<string, AgentListItem[]> = {};
    for (const agent of categories) {
      const cat = agent.category.toLowerCase().replace("_", "-");
      if (!grouped[cat]) grouped[cat] = [];
      if (grouped[cat].length < 8) grouped[cat].push(agent as AgentListItem);
    }

    return { success: true, data: grouped };
  } catch (error) {
    return { success: false, error: "Failed to fetch agents by category", code: "INTERNAL" };
  }
}