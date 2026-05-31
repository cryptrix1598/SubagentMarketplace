"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";
import { organizationSchema } from "@/lib/validations";
import { NotFoundError, ForbiddenError, ConflictError } from "@/lib/errors";
import { sendOrganizationInviteEmail } from "@/server/email";
import type { ActionResult, OrganizationWithMembers } from "@/types";

export async function createOrganization(
  formData: unknown,
): Promise<ActionResult<{ id: string; slug: string }>> {
  try {
    const session = await requireAuth();
    const validated = organizationSchema.parse(formData);

    const existing = await prisma.organization.findUnique({ where: { slug: validated.slug } });
    if (existing) throw new ConflictError(`Organization '${validated.slug}' already exists`);

    const org = await prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name: validated.name,
          slug: validated.slug,
          description: validated.description,
          website: validated.website,
        },
      });

      await tx.organizationMember.create({
        data: {
          organizationId: organization.id,
          userId: session.user.id,
          role: "OWNER",
        },
      });

      return organization;
    });

    return { success: true, data: { id: org.id, slug: org.slug } };
  } catch (error) {
    if (error instanceof ConflictError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Failed to create organization", code: "INTERNAL" };
  }
}

export async function updateOrganization(
  orgId: string,
  formData: unknown,
): Promise<ActionResult<any>> {
  try {
    const session = await requireAuth();
    const member = await prisma.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: orgId, userId: session.user.id } },
    });

    if (!member || (member.role !== "OWNER" && member.role !== "ADMIN")) {
      throw new ForbiddenError("Only owners and admins can update organizations");
    }

    const validated = organizationSchema.partial().parse(formData);

    await prisma.organization.update({
      where: { id: orgId },
      data: {
        ...(validated.name && { name: validated.name }),
        ...(validated.description !== undefined && { description: validated.description }),
        ...(validated.website !== undefined && { website: validated.website }),
      },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Failed to update organization", code: "INTERNAL" };
  }
}

export async function inviteMember(
  orgId: string,
  userId: string,
  role: string,
): Promise<ActionResult<any>> {
  try {
    const session = await requireAuth();
    const member = await prisma.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: orgId, userId: session.user.id } },
    });

    if (!member || (member.role !== "OWNER" && member.role !== "ADMIN")) {
      throw new ForbiddenError("Only owners and admins can invite members");
    }

    const existing = await prisma.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: orgId, userId } },
    });

    if (existing) throw new ConflictError("User is already a member");

    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser) throw new NotFoundError("User", userId);

    const org = await prisma.organization.findUnique({ where: { id: orgId } });

    await prisma.organizationMember.create({
      data: { organizationId: orgId, userId, role: role as "ADMIN" | "MAINTAINER" | "MEMBER" },
    });

    if (org) {
      sendOrganizationInviteEmail(
        targetUser.email,
        org.name,
        session.user.displayName || session.user.name || "Someone",
        role,
      ).catch(() => {});
    }

    return { success: true };
  } catch (error) {
    if (error instanceof ForbiddenError || error instanceof ConflictError || error instanceof NotFoundError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Failed to invite member", code: "INTERNAL" };
  }
}

export async function removeMember(orgId: string, userId: string): Promise<ActionResult<any>> {
  try {
    const session = await requireAuth();
    const member = await prisma.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: orgId, userId: session.user.id } },
    });

    if (!member || (member.role !== "OWNER" && member.role !== "ADMIN")) {
      throw new ForbiddenError("Only owners and admins can remove members");
    }

    const targetMember = await prisma.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: orgId, userId } },
    });

    if (!targetMember) throw new NotFoundError("Member");

    if (targetMember.role === "OWNER") {
      return { success: false, error: "Cannot remove the owner", code: "FORBIDDEN" };
    }

    await prisma.organizationMember.delete({
      where: { id: targetMember.id },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof ForbiddenError || error instanceof NotFoundError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Failed to remove member", code: "INTERNAL" };
  }
}

export async function updateMemberRole(
  orgId: string,
  userId: string,
  role: string,
): Promise<ActionResult<any>> {
  try {
    const session = await requireAuth();
    const member = await prisma.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: orgId, userId: session.user.id } },
    });

    if (!member || member.role !== "OWNER") {
      throw new ForbiddenError("Only owners can change roles");
    }

    if (userId === session.user.id) {
      return { success: false, error: "Cannot change your own role", code: "FORBIDDEN" };
    }

    await prisma.organizationMember.update({
      where: { organizationId_userId: { organizationId: orgId, userId } },
      data: { role: role as "ADMIN" | "MAINTAINER" | "MEMBER" },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Failed to update role", code: "INTERNAL" };
  }
}

export async function getOrganization(
  slug: string,
): Promise<ActionResult<OrganizationWithMembers>> {
  try {
    const org = await prisma.organization.findUnique({
      where: { slug },
      include: {
        members: {
          include: {
            user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
          },
          orderBy: { createdAt: "asc" },
        },
        _count: { select: { agents: true } },
      },
    });

    if (!org) throw new NotFoundError("Organization");

    return { success: true, data: org as OrganizationWithMembers };
  } catch (error) {
    if (error instanceof NotFoundError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Failed to fetch organization", code: "INTERNAL" };
  }
}

export async function getUserOrganizations(): Promise<ActionResult<any>> {
  try {
    const session = await requireAuth();

    const memberships = await prisma.organizationMember.findMany({
      where: { userId: session.user.id },
      include: {
        organization: {
          include: {
            _count: { select: { agents: true, members: true } },
          },
        },
      },
    });

    return {
      success: true,
      data: memberships.map((m) => ({
        ...m.organization,
        role: m.role,
      })),
    };
  } catch (error) {
    return { success: false, error: "Failed to fetch organizations", code: "INTERNAL" };
  }
}

export async function deleteOrganization(orgId: string): Promise<ActionResult<any>> {
  try {
    const session = await requireAuth();
    const member = await prisma.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: orgId, userId: session.user.id } },
    });

    if (!member || member.role !== "OWNER") {
      throw new ForbiddenError("Only the owner can delete an organization");
    }

    await prisma.organization.delete({ where: { id: orgId } });
    return { success: true };
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Failed to delete organization", code: "INTERNAL" };
  }
}