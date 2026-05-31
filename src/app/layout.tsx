import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { PostHogProviderWrapper } from "@/components/layout/posthog-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Claude Agent Hub — The Marketplace for Claude Code Subagents",
    template: "%s | Claude Agent Hub",
  },
  description:
    "Discover, publish, and share Claude Code subagents. The npm for AI agents — browse trending agents, install with one command, and build faster with the community.",
  keywords: [
    "Claude Code",
    "subagents",
    "AI agents",
    "marketplace",
    "registry",
    "package manager",
    "Claude",
    "Anthropic",
  ],
  authors: [{ name: "Claude Agent Hub" }],
  creator: "Claude Agent Hub",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://claudeagenthub.dev",
    siteName: "Claude Agent Hub",
    title: "Claude Agent Hub — The Marketplace for Claude Code Subagents",
    description:
      "Discover, publish, and share Claude Code subagents. The npm for AI agents.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Claude Agent Hub" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Claude Agent Hub — The Marketplace for Claude Code Subagents",
    description:
      "Discover, publish, and share Claude Code subagents. The npm for AI agents.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  metadataBase: new URL(process.env["NEXT_PUBLIC_APP_URL"] || "https://claudeagenthub.dev"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <PostHogProviderWrapper>
            <TooltipProvider>
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </TooltipProvider>
          </PostHogProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}