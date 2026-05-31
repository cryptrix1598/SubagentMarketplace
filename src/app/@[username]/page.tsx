import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUserProfile, getUserAgents } from "@/actions/user";
import { checkFollowing } from "@/actions/follow";
import { ProfilePageClient } from "./profile-client";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  const cleanUsername = username.replace("%40", "").replace("@", "");
  const result = await getUserProfile(cleanUsername);

  if (!result.success || !result.data) {
    return { title: "User Not Found" };
  }

  const user = result.data;
  return {
    title: `${user.displayName || user.username} — Claude Agent Hub`,
    description: user.bio || `Profile of ${user.displayName || user.username} on Claude Agent Hub`,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const cleanUsername = username.replace("%40", "").replace("@", "");
  const profileResult = await getUserProfile(cleanUsername);
  const agentsResult = await getUserAgents(cleanUsername);
  const followResult = await checkFollowing(cleanUsername);

  if (!profileResult.success || !profileResult.data) {
    notFound();
  }

  return (
    <ProfilePageClient
      user={profileResult.data}
      agents={agentsResult.success ? agentsResult.data?.items || [] : []}
      isFollowing={followResult.success ? followResult.data || false : false}
    />
  );
}