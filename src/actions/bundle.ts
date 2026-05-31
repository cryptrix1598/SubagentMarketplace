"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";
import { bundleSchema } from "@/lib/validations";
import { NotFoundError, ForbiddenError, ConflictError } from "@/lib/errors";
import type { ActionResult, BundleWithAgents } from "@/types";

export async function createBundle(
  formData: unknown,
): Promise<ActionResult<{ id: string; slug: string }>> {
  try {
    const session = await requireAuth();
    const validated = bundleSchema.parse(formData);

    const existing = await prisma.bundle.findUnique({
      where: { userId_slug: { userId: session.user.id, slug: validated.slug } },
    });

    if (existing) throw new ConflictError(`Bundle '${validated.slug}' already exists`);

    const agents = await prisma.agent.findMany({
      where: { id: { in: validated.agentIds } },
    });

    if (agents.length !== validated.agentIds.length) {
      return { success: false, error: "One or more agents not found", code: "NOT_FOUND" };
    }

    const bundle = await prisma.$transaction(async (tx) => {
      const b = await tx.bundle.create({
        data: {
          name: validated.name,
          slug: validated.slug,
          description: validated.description,
          userId: session.user.id,
          isPublic: validated.isPublic,
        },
      });

      await tx.bundleAgent.createMany({
        data: validated.agentIds.map((agentId, index) => ({
          bundleId: b.id,
          agentId,
          order: index,
        })),
      });

      return b;
    });

    return { success: true, data: { id: bundle.id, slug: bundle.slug } };
  } catch (error) {
    if (error instanceof ConflictError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Failed to create bundle", code: "INTERNAL" };
  }
}

export async function updateBundle(
  bundleId: string,
  formData: unknown,
): Promise<ActionResult<any>> {
  try {
    const session = await requireAuth();
    const bundle = await prisma.bundle.findUnique({ where: { id: bundleId } });

    if (!bundle) throw new NotFoundError("Bundle", bundleId);
    if (bundle.userId !== session.user.id) throw new ForbiddenError();

    const validated = bundleSchema.partial().parse(formData);

    await prisma.bundle.update({
      where: { id: bundleId },
      data: {
        ...(validated.name && { name: validated.name }),
        ...(validated.description && { description: validated.description }),
        ...(validated.isPublic !== undefined && { isPublic: validated.isPublic }),
      },
    });

    if (validated.agentIds && validated.agentIds.length > 0) {
      await prisma.bundleAgent.deleteMany({ where: { bundleId } });
      await prisma.bundleAgent.createMany({
        data: validated.agentIds.map((agentId, index) => ({
          bundleId,
          agentId,
          order: index,
        })),
      });
    }

    return { success: true };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Failed to update bundle", code: "INTERNAL" };
  }
}

export async function getBundle(bundleId: string): Promise<ActionResult<BundleWithAgents>> {
  try {
    const bundle = await prisma.bundle.findUnique({
      where: { id: bundleId },
      include: {
        user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
        agents: {
          include: {
            agent: {
              include: {
                publisher: {
                  select: { id: true, username: true, displayName: true, avatarUrl: true, isVerified: true },
                },
                tags: true,
              },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!bundle) throw new NotFoundError("Bundle");
    if (!bundle.isPublic) {
      const session = await requireAuth().catch(() => null);
      if (!session || session.user.id !== bundle.userId) {
        throw new NotFoundError("Bundle");
      }
    }

    return { success: true, data: bundle as BundleWithAgents };
  } catch (error) {
    if (error instanceof NotFoundError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Failed to fetch bundle", code: "INTERNAL" };
  }
}

export async function getPublicBundles(page: number = 1, pageSize: number = 24): Promise<ActionResult<any>> {
  try {
    const [bundles, total] = await Promise.all([
      prisma.bundle.findMany({
        where: { isPublic: true },
        include: {
          user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
          _count: { select: { agents: true } },
        },
        orderBy: { downloads: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.bundle.count({ where: { isPublic: true } }),
    ]);

    return {
      success: true,
      data: {
        items: bundles,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    return { success: false, error: "Failed to fetch bundles", code: "INTERNAL" };
  }
}

export async function installBundle(bundleId: string): Promise<ActionResult<any>> {
  try {
    const session = await requireAuth().catch(() => null);

    await prisma.bundle.update({
      where: { id: bundleId },
      data: { downloads: { increment: 1 } },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to install bundle", code: "INTERNAL" };
  }
}

export async function deleteBundle(bundleId: string): Promise<ActionResult<any>> {
  try {
    const session = await requireAuth();
    const bundle = await prisma.bundle.findUnique({ where: { id: bundleId } });

    if (!bundle) throw new NotFoundError("Bundle", bundleId);
    if (bundle.userId !== session.user.id) throw new ForbiddenError();

    await prisma.bundle.delete({ where: { id: bundleId } });
    return { success: true };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Failed to delete bundle", code: "INTERNAL" };
  }
}