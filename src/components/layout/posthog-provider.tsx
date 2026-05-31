"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

const POSTHOG_KEY = process.env["NEXT_PUBLIC_POSTHOG_KEY"];
const POSTHOG_HOST = process.env["NEXT_PUBLIC_POSTHOG_HOST"] || "https://us.i.posthog.com";

if (typeof window !== "undefined" && POSTHOG_KEY) {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: "identified_only",
  });
}

export function PostHogProviderWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!POSTHOG_KEY) return;
    const handlePageview = () => posthog.capture("$pageview");
    window.addEventListener("routeChangeComplete", handlePageview);
    return () => window.removeEventListener("routeChangeComplete", handlePageview);
  }, []);

  if (!POSTHOG_KEY) {
    return <>{children}</>;
  }

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}