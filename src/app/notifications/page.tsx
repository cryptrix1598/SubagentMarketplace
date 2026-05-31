import { Metadata } from "next";
import { getNotifications } from "@/actions/notification";
import { NotificationsPageClient } from "./notifications-client";

export const metadata: Metadata = {
  title: "Notifications",
};

export default async function NotificationsPage() {
  const result = await getNotifications();
  const notifications = result.success && result.data ? result.data.items || [] : [];

  return <NotificationsPageClient notifications={notifications} />;
}