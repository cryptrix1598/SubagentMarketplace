import Link from "next/link";
import { Package, Github, Twitter } from "lucide-react";

const footerLinks = {
  Product: [
    { href: "/explore", label: "Explore Agents" },
    { href: "/categories", label: "Categories" },
    { href: "/bundles", label: "Bundles" },
    { href: "/collections", label: "Collections" },
    { href: "/pricing", label: "Pricing" },
  ],
  Resources: [
    { href: "/docs", label: "Documentation" },
    { href: "/docs/publishing", label: "Publishing Guide" },
    { href: "/docs/api", label: "API Reference" },
    { href: "/docs/self-hosting", label: "Self-Hosting" },
    { href: "/roadmap", label: "Roadmap" },
  ],
  Community: [
    { href: "https://github.com/claude-agent-hub", label: "GitHub", external: true },
    { href: "https://discord.gg/claude-agent-hub", label: "Discord", external: true },
    { href: "https://twitter.com/agenthub", label: "Twitter", external: true },
    { href: "/contributing", label: "Contributing" },
    { href: "/code-of-conduct", label: "Code of Conduct" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/security", label: "Security" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold">AgentHub</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              The marketplace, registry, and package manager for Claude Code subagents.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="https://github.com/claude-agent-hub"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/agenthub"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold">{title}</h3>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      {...("external" in link && link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Claude Agent Hub. Open source under MIT.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with ❤️ for the Claude Code community
          </p>
        </div>
      </div>
    </footer>
  );
}