"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";
import { reviewSchema } from "@/lib/validations";
import { NotFoundError, ForbiddenError, ConflictError } from "@/lib/errors";
import { reviewRateLimit } from "@/server/rate-limit";
import type { ActionResult, Review } from "@/types";

export async function createReview(
  agentId: string,
  formData: unknown,
): Promise<ActionResult<Review>> {
  try {
    const session = await requireAuth();
    const rateLimitResult = reviewRateLimit(session.user.id);
    if (!rateLimitResult.allowed) {
      return { success: false, error: "Rate limit exceeded", code: "RATE_LIMIT" };
    }

    const agent = await prisma.agent.findUnique({ where: { id: agentId } });
    if (!agent) throw new NotFoundError("Agent", agentId);

    if (agent.publisherId === session.user.id) {
      return { success: false, error: "You cannot review your own agent", code: "FORBIDDEN" };
    }

    const existingReview = await prisma.review.findUnique({
      where: { agentId_userId: { agentId, userId: session.user.id } },
    });

    if (existingReview) {
      throw new ConflictError("You have already reviewed this agent");
    }

    const validated = reviewSchema.parse(formData);

    const review = await prisma.$transaction(async (tx) => {
      const newReview = await tx.review.create({
        data: {
          agentId,
          userId: session.user.id,
          rating: validated.rating,
          comment: validated.comment,
        },
        include: {
          user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
        },
      });

      const stats = await tx.review.aggregate({
        where: { agentId },
        _avg: { rating: true },
        _count: true,
      });

      await tx.agent.update({
        where: { id: agentId },
        data: {
          reviewsCount: stats._count,
          averageRating: stats._avg.rating || 0,
        },
      });

      return newReview;
    });

    return { success: true, data: review as Review };
  } catch (error) {
    if (error instanceof ConflictError || error instanceof NotFoundError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Failed to create review", code: "INTERNAL" };
  }
}

export async function updateReview(
  reviewId: string,
  formData: unknown,
): Promise<ActionResult<any>> {
  try {
    const session = await requireAuth();
    const review = await prisma.review.findUnique({ where: { id: reviewId } });

    if (!review) throw new NotFoundError("Review", reviewId);
    if (review.userId !== session.user.id) throw new ForbiddenError();

    const validated = reviewSchema.parse(formData);

    await prisma.$transaction(async (tx) => {
      await tx.review.update({
        where: { id: reviewId },
        data: {
          rating: validated.rating,
          comment: validated.comment,
        },
      });

      const stats = await tx.review.aggregate({
        where: { agentId: review.agentId },
        _avg: { rating: true },
      });

      await tx.agent.update({
        where: { id: review.agentId },
        data: { averageRating: stats._avg.rating || 0 },
      });
    });

    return { success: true };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Failed to update review", code: "INTERNAL" };
  }
}

export async function deleteReview(reviewId: string): Promise<ActionResult<any>> {
  try {
    const session = await requireAuth();
    const review = await prisma.review.findUnique({ where: { id: reviewId } });

    if (!review) throw new NotFoundError("Review", reviewId);
    if (review.userId !== session.user.id && session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      throw new ForbiddenError();
    }

    await prisma.$transaction(async (tx) => {
      await tx.review.delete({ where: { id: reviewId } });

      const stats = await tx.review.aggregate({
        where: { agentId: review.agentId },
        _avg: { rating: true },
        _count: true,
      });

      await tx.agent.update({
        where: { id: review.agentId },
        data: {
          reviewsCount: stats._count,
          averageRating: stats._avg.rating || 0,
        },
      });
    });

    return { success: true };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Failed to delete review", code: "INTERNAL" };
  }
}

export async function getAgentReviews(
  agentId: string,
  page: number = 1,
  pageSize: number = 20,
): Promise<ActionResult<any>> {
  try {
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { agentId },
        include: {
          user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.review.count({ where: { agentId } }),
    ]);

    return {
      success: true,
      data: {
        items: reviews,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    return { success: false, error: "Failed to fetch reviews", code: "INTERNAL" };
  }
}