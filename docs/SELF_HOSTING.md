# Self-Hosting Guide

This guide covers deploying Claude Agent Hub on your own infrastructure.

## Prerequisites

- Docker and Docker Compose
- A domain name (optional)
- SSL certificate (recommended)

## Quick Start with Docker

1. Clone the repository:
```bash
git clone https://github.com/claude-agent-hub/claude-agent-hub.git
cd claude-agent-hub
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://postgres:yourpassword@db:5432/claude_agent_hub"
BETTER_AUTH_SECRET="your-secret-key-at-least-32-characters-long"
BETTER_AUTH_URL="https://your-domain.com"
```

4. Start services:
```bash
docker compose up -d
```

5. Run migrations:
```bash
docker compose exec app pnpm db:migrate:deploy
```

6. (Optional) Seed the database:
```bash
docker compose exec app pnpm db:seed
```

## Docker Compose Configuration

The included `docker-compose.yml` provides:
- **app** — Next.js application (port 3000)
- **db** — PostgreSQL 16 database (port 5432)
- **minio** — S3-compatible storage (port 9000)

## Production Deployment

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | ✅ | 32+ character secret key |
| `BETTER_AUTH_URL` | ✅ | Public URL of your instance |
| `GOOGLE_CLIENT_ID` | ❌ | Google OAuth (for social login) |
| `GITHUB_CLIENT_ID` | ❌ | GitHub OAuth (for social login) |
| `S3_ENDPOINT` | ❌ | S3 storage endpoint |
| `RESEND_API_KEY` | ❌ | Resend for transactional emails |
| `NEXT_PUBLIC_POSTHOG_KEY` | ❌ | PostHog analytics |

### SSL/TLS

Use a reverse proxy like Nginx or Caddy for SSL termination:

**Caddy (recommended):**
```
yourdomain.com {
    reverse_proxy localhost:3000
}
```

**Nginx:**
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Database Backups

Set up regular PostgreSQL backups:

```bash
# Daily backup cron
0 2 * * * pg_dump -U postgres claude_agent_hub > /backups/backup_$(date +\%Y\%m\%d).sql
```

### Scaling

For high-traffic deployments:

1. **Database**: Use a managed PostgreSQL service (AWS RDS, Supabase, etc.)
2. **Storage**: Use AWS S3 instead of MinIO
3. **Cache**: Add Redis for session storage and caching
4. **CDN**: Use CloudFront or Cloudflare for static assets
5. **Load Balancer**: Use multiple app instances behind a load balancer

### Monitoring

- **Health Check**: `GET /api/health`
- **Metrics**: Integrate with PostHog or Prometheus
- **Logs**: Use Docker logs or a log aggregation service
- **Uptime**: Use a service like UptimeRobot

## Upgrading

```bash
git pull origin main
docker compose build
docker compose up -d
docker compose exec app pnpm db:migrate:deploy
```