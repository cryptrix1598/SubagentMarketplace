"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";
import { NotFoundError, ConflictError } from "@/lib/errors";
import { slugify } from "@/lib/utils";
import type { ActionResult } from "@/types";

export async function forkAgent(agentId: string): Promise<ActionResult<{ id: string; slug: string }>> {
  try {
    const session = await requireAuth();
    const parentAgent = await prisma.agent.findUnique({
      where: { id: agentId },
      include: { tags: true, versions: { where: { isLatest: true }, take: 1 }, publisher: { select: { username: true } } },
    });

    if (!parentAgent) throw new NotFoundError("Agent", agentId);

    const slug = slugify(`${parentAgent.slug}-fork-${Date.now()}`);

    const existing = await prisma.agent.findUnique({
      where: { publisherId_slug: { publisherId: session.user.id, slug } },
    });

    if (existing) {
      throw new ConflictError("You already have a fork of this agent");
    }

    const forkedAgent = await prisma.$transaction(async (tx) => {
      const agent = await tx.agent.create({
        data: {
          name: `${parentAgent.name} (Fork)`,
          slug,
          description: parentAgent.description,
          longDescription: parentAgent.longDescription,
          category: parentAgent.category,
          license: parentAgent.license,
          version: parentAgent.version,
          readme: parentAgent.readme,
          installationInstructions: parentAgent.installationInstructions,
          publisherId: session.user.id,
          publishedAt: new Date(),
          tags: {
            create: parentAgent.tags.map((t) => ({ tag: t.tag })),
          },
          versions: {
            create: {
              version: parentAgent.version,
              changelog: `Forked from ${parentAgent.publisher.username}/${parentAgent.slug}`,
              isLatest: true,
            },
          },
        },
      });

      await tx.fork.create({
        data: {
          agentId: agent.id,
          parentAgentId: parentAgent.id,
        },
      });

      await tx.agent.update({
        where: { id: parentAgent.id },
        data: { forksCount: { increment: 1 } },
      });

      await tx.notification.create({
        data: {
          userId: parentAgent.publisherId,
          type: "NEW_FORK",
          title: "Your agent was forked!",
          message: `${session.user.displayName || session.user.name} forked your agent "${parentAgent.name}"`,
          data: { agentId: parentAgent.id, forkId: agent.id, forkedBy: session.user.id },
        },
      });

      return agent;
    });

    return { success: true, data: { id: forkedAgent.id, slug: forkedAgent.slug } };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ConflictError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Failed to fork agent", code: "INTERNAL" };
  }
}

export async function getForkGraph(agentId: string): Promise<ActionResult<any>> {
  try {
    const forks = await prisma.fork.findMany({
      where: { parentAgentId: agentId },
      include: {
        agent: {
          include: {
            publisher: { select: { username: true, displayName: true, avatarUrl: true } },
          },
        },
      },
    });

    const childForkIds = forks.map((f) => f.agentId);
    const nestedForks = childForkIds.length > 0
      ? await prisma.fork.findMany({
          where: { parentAgentId: { in: childForkIds } },
          include: {
            agent: {
              include: {
                publisher: { select: { username: true, displayName: true, avatarUrl: true } },
              },
            },
          },
        })
      : [];

    return {
      success: true,
      data: {
        parent: agentId,
        forks: forks.map((f) => ({
          id: f.agentId,
          name: f.agent.name,
          slug: f.agent.slug,
          publisher: f.agent.publisher,
          createdAt: f.createdAt,
        })),
        nestedForks: nestedForks.map((f) => ({
          id: f.agentId,
          parentId: f.parentAgentId,
          name: f.agent.name,
          slug: f.agent.slug,
          publisher: f.agent.publisher,
          createdAt: f.createdAt,
        })),
      },
    };
  } catch (error) {
    return { success: false, error: "Failed to fetch fork graph", code: "INTERNAL" };
  }
}