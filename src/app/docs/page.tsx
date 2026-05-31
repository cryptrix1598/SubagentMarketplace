import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Learn how to use, publish, and manage Claude Code subagents.",
};

const docSections = [
  {
    title: "Getting Started",
    links: [
      { href: "/docs/installation", label: "Installation" },
      { href: "/docs/quick-start", label: "Quick Start Guide" },
      { href: "/docs/concepts", label: "Core Concepts" },
    ],
  },
  {
    title: "Publishing",
    links: [
      { href: "/docs/publishing", label: "Publishing Your First Agent" },
      { href: "/docs/agent-structure", label: "Agent File Structure" },
      { href: "/docs/versioning", label: "Versioning Best Practices" },
      { href: "/docs/validation", label: "Validation & Security" },
    ],
  },
  {
    title: "Using Agents",
    links: [
      { href: "/docs/installing", label: "Installing Agents" },
      { href: "/docs/configuration", label: "Configuration" },
      { href: "/docs/bundles", label: "Working with Bundles" },
      { href: "/docs/collections", label: "Collections" },
    ],
  },
  {
    title: "Advanced",
    links: [
      { href: "/docs/api", label: "API Reference" },
      { href: "/docs/self-hosting", label: "Self-Hosting" },
      { href: "/docs/cli", label: "CLI Reference" },
      { href: "/docs/webhooks", label: "Webhooks" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "/docs/contributing", label: "Contributing Guide" },
      { href: "/docs/code-of-conduct", label: "Code of Conduct" },
      { href: "/docs/security", label: "Security Policy" },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Documentation</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Everything you need to know about Claude Agent Hub.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {docSections.map((section) => (
          <div key={section.title}>
            <h2 className="mb-4 text-lg font-semibold">{section.title}</h2>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="flex items-center gap-2 rounded-lg p-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}