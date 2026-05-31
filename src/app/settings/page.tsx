import { Metadata } from "next";
import { SettingsPageClient } from "./settings-client";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings and profile.",
};

export default function SettingsPage() {
  return <SettingsPageClient />;
}