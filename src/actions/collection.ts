"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";
import { collectionSchema } from "@/lib/validations";
import { NotFoundError, ForbiddenError } from "@/lib/errors";
import type { ActionResult, CollectionWithAgents } from "@/types";

export async function createCollection(
  formData: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await requireAuth();
    const validated = collectionSchema.parse(formData);

    const collection = await prisma.$transaction(async (tx) => {
      const coll = await tx.collection.create({
        data: {
          title: validated.title,
          description: validated.description,
          visibility: validated.visibility.toUpperCase() as "PUBLIC",
          userId: session.user.id,
        },
      });

      if (validated.agentIds.length > 0) {
        await tx.collectionAgent.createMany({
          data: validated.agentIds.map((agentId, index) => ({
            collectionId: coll.id,
            agentId,
            order: index,
          })),
        });
      }

      return coll;
    });

    return { success: true, data: { id: collection.id } };
  } catch (error) {
    return { success: false, error: "Failed to create collection", code: "INTERNAL" };
  }
}

export async function updateCollection(
  collectionId: string,
  formData: unknown,
): Promise<ActionResult<any>> {
  try {
    const session = await requireAuth();
    const collection = await prisma.collection.findUnique({ where: { id: collectionId } });

    if (!collection) throw new NotFoundError("Collection", collectionId);
    if (collection.userId !== session.user.id) throw new ForbiddenError();

    const validated = collectionSchema.partial().parse(formData);

    await prisma.collection.update({
      where: { id: collectionId },
      data: {
        ...(validated.title && { title: validated.title }),
        ...(validated.description !== undefined && { description: validated.description }),
        ...(validated.visibility && { visibility: validated.visibility.toUpperCase() as "PUBLIC" }),
      },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Failed to update collection", code: "INTERNAL" };
  }
}

export async function addAgentToCollection(
  collectionId: string,
  agentId: string,
): Promise<ActionResult<any>> {
  try {
    const session = await requireAuth();
    const collection = await prisma.collection.findUnique({ where: { id: collectionId } });

    if (!collection) throw new NotFoundError("Collection", collectionId);
    if (collection.userId !== session.user.id) throw new ForbiddenError();

    const existing = await prisma.collectionAgent.findUnique({
      where: { collectionId_agentId: { collectionId, agentId } },
    });

    if (existing) {
      return { success: false, error: "Agent already in collection", code: "CONFLICT" };
    }

    const maxOrder = await prisma.collectionAgent.aggregate({
      where: { collectionId },
      _max: { order: true },
    });

    await prisma.collectionAgent.create({
      data: {
        collectionId,
        agentId,
        order: (maxOrder._max.order || 0) + 1,
      },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Failed to add agent to collection", code: "INTERNAL" };
  }
}

export async function removeAgentFromCollection(
  collectionId: string,
  agentId: string,
): Promise<ActionResult<any>> {
  try {
    const session = await requireAuth();
    const collection = await prisma.collection.findUnique({ where: { id: collectionId } });

    if (!collection) throw new NotFoundError("Collection", collectionId);
    if (collection.userId !== session.user.id) throw new ForbiddenError();

    await prisma.collectionAgent.delete({
      where: { collectionId_agentId: { collectionId, agentId } },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Failed to remove agent from collection", code: "INTERNAL" };
  }
}

export async function getCollection(
  collectionId: string,
): Promise<ActionResult<CollectionWithAgents>> {
  try {
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
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
        _count: { select: { agents: true } },
      },
    });

    if (!collection) throw new NotFoundError("Collection");
    if (collection.visibility === "PRIVATE") {
      const session = await requireAuth().catch(() => null);
      if (!session || session.user.id !== collection.userId) {
        throw new NotFoundError("Collection");
      }
    }

    return { success: true, data: collection as CollectionWithAgents };
  } catch (error) {
    if (error instanceof NotFoundError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Failed to fetch collection", code: "INTERNAL" };
  }
}

export async function getUserCollections(userId: string): Promise<ActionResult<any>> {
  try {
    const session = await requireAuth().catch(() => null);

    const collections = await prisma.collection.findMany({
      where: {
        userId,
        ...(session?.user.id !== userId ? { visibility: "PUBLIC" } : {}),
      },
      include: {
        _count: { select: { agents: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return { success: true, data: collections };
  } catch (error) {
    return { success: false, error: "Failed to fetch collections", code: "INTERNAL" };
  }
}

export async function deleteCollection(collectionId: string): Promise<ActionResult<any>> {
  try {
    const session = await requireAuth();
    const collection = await prisma.collection.findUnique({ where: { id: collectionId } });

    if (!collection) throw new NotFoundError("Collection", collectionId);
    if (collection.userId !== session.user.id) throw new ForbiddenError();

    await prisma.collection.delete({ where: { id: collectionId } });
    return { success: true };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Failed to delete collection", code: "INTERNAL" };
  }
}

export async function getPublicCollections(page: number = 1, pageSize: number = 24): Promise<ActionResult<any>> {
  try {
    const [collections, total] = await Promise.all([
      prisma.collection.findMany({
        where: { visibility: "PUBLIC" },
        include: {
          user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
          _count: { select: { agents: true } },
        },
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.collection.count({ where: { visibility: "PUBLIC" } }),
    ]);

    return {
      success: true,
      data: {
        items: collections,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    return { success: false, error: "Failed to fetch collections", code: "INTERNAL" };
  }
}