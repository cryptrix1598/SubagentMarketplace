import { PostHog } from "posthog-node";

let posthogClient: PostHog | null = null;

function getPostHogClient(): PostHog | null {
  if (!process.env["NEXT_PUBLIC_POSTHOG_KEY"]) return null;
  if (!posthogClient) {
    posthogClient = new PostHog(process.env["NEXT_PUBLIC_POSTHOG_KEY"], {
      host: process.env["NEXT_PUBLIC_POSTHOG_HOST"] || "https://us.i.posthog.com",
      personalApiKey: process.env["POSTHOG_PERSONAL_API_KEY"],
    });
  }
  return posthogClient;
}

export async function trackEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, unknown>,
): Promise<void> {
  const client = getPostHogClient();
  if (!client) return;

  try {
    client.capture({
      distinctId,
      event,
      properties: {
        ...properties,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error("PostHog track error:", error);
  }
}

export async function trackPageView(
  distinctId: string,
  page: string,
  properties?: Record<string, unknown>,
): Promise<void> {
  await trackEvent(distinctId, "$pageview", {
    $current_url: page,
    ...properties,
  });
}

export async function trackAgentView(
  userId: string,
  agentId: string,
  agentName: string,
): Promise<void> {
  await trackEvent(userId, "agent_viewed", {
    agentId,
    agentName,
  });
}

export async function trackAgentInstall(
  userId: string,
  agentId: string,
  agentName: string,
  version: string,
): Promise<void> {
  await trackEvent(userId, "agent_installed", {
    agentId,
    agentName,
    version,
  });
}

export async function trackAgentPublish(
  userId: string,
  agentId: string,
  agentName: string,
): Promise<void> {
  await trackEvent(userId, "agent_published", {
    agentId,
    agentName,
  });
}

export async function trackSearch(
  userId: string,
  query: string,
  resultCount: number,
): Promise<void> {
  await trackEvent(userId, "search_performed", {
    query,
    resultCount,
  });
}

export async function identifyUser(
  distinctId: string,
  properties: Record<string, unknown>,
): Promise<void> {
  const client = getPostHogClient();
  if (!client) return;

  try {
    client.identify({
      distinctId,
      properties,
    });
  } catch (error) {
    console.error("PostHog identify error:", error);
  }
}

export async function shutdownAnalytics(): Promise<void> {
  if (posthogClient) {
    await posthogClient.shutdown();
    posthogClient = null;
  }
}