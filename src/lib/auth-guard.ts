import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { UnauthorizedError } from "@/lib/errors";
import type { Session } from "@/server/auth";

export async function getSessionServer(): Promise<Session | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session as Session | null;
}

export async function requireAuth(): Promise<Session> {
  const session = await getSessionServer();
  if (!session) {
    throw new UnauthorizedError();
  }
  return session;
}

export async function requireAdmin(): Promise<Session> {
  const session = await requireAuth();
  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    throw new UnauthorizedError("Admin access required");
  }
  return session;
}

export async function requireVerified(): Promise<Session> {
  const session = await requireAuth();
  if (!session.user.emailVerified) {
    throw new UnauthorizedError("Email verification required");
  }
  return session;
}