# Claude Agent Hub

> The marketplace, registry, and package manager for Claude Code subagents.

[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)

**Think: GitHub + npm + VSCode Marketplace + Docker Hub — but specifically for Claude Code subagents.**

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 15+
- (Optional) MinIO or S3-compatible storage
- (Optional) Resend for emails
- (Optional) PostHog for analytics

### Installation

```bash
# Clone the repository
git clone https://github.com/claude-agent-hub/claude-agent-hub.git
cd claude-agent-hub

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Set up the database
pnpm db:generate
pnpm db:push

# Seed the database (optional, for development)
pnpm db:seed

# Start the development server
pnpm dev
```

Visit `http://localhost:3000` to see the application.

## ✨ Features

- **Agent Registry** — Publish, version, and manage Claude Code subagents
- **Discovery** — Search, browse, and filter agents by category, tags, and popularity
- **One-Command Install** — `claude agent install publisher/agent`
- **Verified Publishers** — Trust indicators and verification badges
- **Ratings & Reviews** — Community-driven quality signals
- **Fork System** — Fork, customize, and contribute back
- **Agent Bundles** — Package multiple agents for complete workflows
- **Collections** — Curate and share agent lists
- **Organizations** — Team management with roles and shared publishing
- **Analytics Dashboard** — Track downloads, views, stars, and growth
- **Admin Panel** — Full moderation and management tools
- **Dark/Light Mode** — Premium UI with smooth transitions
- **SEO Optimized** — Metadata, sitemaps, structured data
- **Rate Limiting** — API and action-level rate limiting
- **Security** — CSRF, XSS protection, Zod validation, audit logging

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript |
| Styling | Tailwind CSS 4, ShadCN UI, Framer Motion |
| Backend | Next.js Server Actions, Route Handlers |
| Database | PostgreSQL, Prisma ORM |
| Auth | Better Auth (email + OAuth) |
| Storage | S3-compatible (MinIO, AWS S3) |
| Search | PostgreSQL Full Text Search |
| Analytics | PostHog |
| Email | Resend |
| Validation | Zod |
| Package Manager | pnpm |

## 📁 Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── @[username]/  # User profiles & agent pages
│   ├── admin/        # Admin panel
│   ├── bundles/      # Agent bundles
│   ├── categories/   # Category browser
│   ├── collections/  # Agent collections
│   ├── dashboard/    # Publisher dashboard
│   ├── docs/         # Documentation
│   ├── explore/      # Agent marketplace
│   ├── notifications/# Notifications
│   ├── publish/      # Publishing wizard
│   ├── settings/     # User settings
│   ├── signin/       # Sign in
│   └── signup/       # Sign up
├── actions/          # Server actions
├── components/       # React components
│   ├── ui/           # ShadCN base components
│   ├── layout/       # Layout (navbar, footer)
│   ├── landing/      # Landing page sections
│   ├── agents/       # Agent-specific components
│   ├── dashboard/    # Dashboard components
│   ├── admin/        # Admin components
│   └── common/       # Shared components
├── hooks/            # Custom React hooks
├── lib/              # Utilities & configurations
├── server/           # Server-side modules
│   ├── auth/         # Better Auth configuration
│   ├── storage/      # S3 file storage
│   ├── email/        # Resend email templates
│   ├── analytics/    # PostHog tracking
│   └── rate-limit/   # Rate limiting
├── types/            # TypeScript type definitions
└── tests/            # Test suites
    ├── unit/         # Unit tests
    ├── integration/  # Integration tests
    └── e2e/          # End-to-end tests
```

## 🔑 Environment Variables

See `.env.example` for all available variables. Key ones:

| Variable | Description | Required |
|----------|------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `BETTER_AUTH_SECRET` | Auth encryption key (32+ chars) | ✅ |
| `BETTER_AUTH_URL` | App URL for auth callbacks | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | ❌ |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | ❌ |
| `S3_ENDPOINT` | S3-compatible storage endpoint | ❌ |
| `RESEND_API_KEY` | Resend email API key | ❌ |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog analytics key | ❌ |

## 🧪 Testing

```bash
# Run unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run e2e tests
pnpm test:e2e
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repository in Vercel
3. Set environment variables
4. Deploy

### Self-Hosting

See [SELF_HOSTING.md](./docs/SELF_HOSTING.md) for complete self-hosting instructions.

## 📖 Documentation

- [Publishing Guide](./docs/PUBLISHING_AGENTS.md)
- [API Reference](./docs/API.md)
- [Self-Hosting](./docs/SELF_HOSTING.md)
- [Contributing](./CONTRIBUTING.md)
- [Security](./SECURITY.md)
- [Roadmap](./ROADMAP.md)

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License — see [LICENSE](./LICENSE) for details.

## 🙏 Acknowledgments

Built with the best open-source tools: Next.js, Prisma, Better Auth, ShadCN UI, Tailwind CSS, and more.

---

<p align="center">
  Built with ❤️ for the Claude Code community
</p>