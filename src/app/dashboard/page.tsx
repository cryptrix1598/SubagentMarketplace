import { Metadata } from "next";
import { getPublisherDashboard } from "@/actions/analytics";
import { DashboardClient } from "./dashboard-client";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your publisher dashboard with analytics and agent management.",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const result = await getPublisherDashboard();
  const stats = result.success ? result.data : null;

  return <DashboardClient stats={stats || null} />;
}