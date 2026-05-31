export function generateInstallCommand(publisherSlug: string, agentSlug: string): string {
  return `claude agent install ${publisherSlug}/${agentSlug}`;
}

export function generateAddCommand(publisherSlug: string, agentSlug: string): string {
  return `claude agent add ${publisherSlug}/${agentSlug}`;
}

export function generateUpdateCommand(publisherSlug: string, agentSlug: string, version?: string): string {
  const versionSuffix = version ? `@${version}` : "";
  return `claude agent update ${publisherSlug}/${agentSlug}${versionSuffix}`;
}

export function generateBundleInstallCommand(publisherSlug: string, bundleSlug: string): string {
  return `claude bundle install ${publisherSlug}/${bundleSlug}`;
}

export function generateUninstallCommand(publisherSlug: string, agentSlug: string): string {
  return `claude agent remove ${publisherSlug}/${agentSlug}`;
}

export function parseAgentIdentifier(identifier: string): { publisher: string; agent: string; version?: string } | null {
  const parts = identifier.split("/");
  if (parts.length !== 2) return null;

  const [publisher, agentPart] = parts;
  if (!agentPart) return null;
  const [agent, version] = agentPart.split("@");

  if (!publisher || !agent) return null;

  return { publisher, agent, version: version || undefined };
}