"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";
import { profileSchema } from "@/lib/validations";
import { NotFoundError, ConflictError } from "@/lib/errors";
import { uploadFile, generateAvatarKey } from "@/server/storage";
import { AVATAR_MAX_SIZE } from "@/lib/constants";
import type { ActionResult, UserWithStats } from "@/types";

export async function updateProfile(formData: unknown): Promise<ActionResult<any>> {
  try {
    const session = await requireAuth();
    const validated = profileSchema.parse(formData);

    if (validated.username) {
      const existing = await prisma.user.findFirst({
        where: { username: validated.username, id: { not: session.user.id } },
      });
      if (existing) throw new ConflictError("Username is already taken");
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(validated.displayName !== undefined && { displayName: validated.displayName }),
        ...(validated.username && { username: validated.username }),
        ...(validated.bio !== undefined && { bio: validated.bio }),
        ...(validated.website !== undefined && { website: validated.website || null }),
        ...(validated.github !== undefined && { github: validated.github }),
        ...(validated.twitter !== undefined && { twitter: validated.twitter }),
        ...(validated.location !== undefined && { location: validated.location }),
      },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof ConflictError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Failed to update profile", code: "INTERNAL" };
  }
}

export async function uploadAvatar(file: File): Promise<ActionResult<{ url: string }>> {
  try {
    const session = await requireAuth();

    if (file.size > AVATAR_MAX_SIZE) {
      return { success: false, error: "Avatar must be under 2MB", code: "VALIDATION" };
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: "Invalid file type", code: "VALIDATION" };
    }

    const ext = file.name.split(".").pop() || "png";
    const key = generateAvatarKey(session.user.id, `avatar.${ext}`);
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadFile(key, buffer, file.type);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { avatarUrl: url },
    });

    return { success: true, data: { url } };
  } catch (error) {
    return { success: false, error: "Failed to upload avatar", code: "INTERNAL" };
  }
}

export async function getUserProfile(
  username: string,
): Promise<ActionResult<UserWithStats>> {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        _count: {
          select: {
            agents: true,
            stars: true,
            followers: true,
            follows: true,
            collections: true,
            bundles: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundError("User");

    return { success: true, data: user as unknown as UserWithStats };
  } catch (error) {
    if (error instanceof NotFoundError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Failed to fetch profile", code: "INTERNAL" };
  }
}

export async function getUserAgents(
  userId: string,
  page: number = 1,
  pageSize: number = 24,
): Promise<ActionResult<any>> {
  try {
    const [agents, total] = await Promise.all([
      prisma.agent.findMany({
        where: { publisherId: userId, isPublic: true },
        include: {
          publisher: {
            select: { id: true, username: true, displayName: true, avatarUrl: true, isVerified: true },
          },
          tags: true,
        },
        orderBy: { downloads: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.agent.count({ where: { publisherId: userId, isPublic: true } }),
    ]);

    return {
      success: true,
      data: {
        items: agents,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    return { success: false, error: "Failed to fetch user agents", code: "INTERNAL" };
  }
}

export async function searchUsers(query: string, limit: number = 10): Promise<ActionResult<any>> {
  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: "insensitive" } },
          { displayName: { contains: query, mode: "insensitive" } },
          { name: { contains: query, mode: "insensitive" } },
        ],
        isBanned: false,
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        isVerified: true,
        bio: true,
      },
      take: limit,
    });

    return { success: true, data: users };
  } catch (error) {
    return { success: false, error: "Failed to search users", code: "INTERNAL" };
  }
}

export async function verifyPublisher(userId: string): Promise<ActionResult<any>> {
  try {
    const session = await requireAuth();
    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return { success: false, error: "Admin access required", code: "FORBIDDEN" };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to verify publisher", code: "INTERNAL" };
  }
}