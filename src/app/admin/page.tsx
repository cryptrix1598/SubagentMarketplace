import { Metadata } from "next";
import { getAdminDashboard } from "@/actions/analytics";
import { AdminPageClient } from "./admin-client";

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Administration panel for Claude Agent Hub.",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const result = await getAdminDashboard();
  const stats = result.success ? result.data : null;

  return <AdminPageClient stats={stats} />;
}