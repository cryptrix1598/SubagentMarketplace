# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x     | ✅ |
| < 1.0   | ❌ |

## Reporting a Vulnerability

We take security seriously. If you discover a vulnerability, please report it responsibly.

**DO NOT** file a public issue. Instead:

1. Email security@claudeagenthub.dev with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

2. You will receive a response within 48 hours.

3. We will keep you updated on the progress.

4. Once fixed, we will publicly acknowledge your contribution (unless you prefer to remain anonymous).

## Security Measures

- **Authentication**: Better Auth with bcrypt password hashing
- **Authorization**: Role-based access control (RBAC)
- **CSRF Protection**: Built-in Next.js CSRF tokens
- **XSS Protection**: Content Security Policy headers
- **Rate Limiting**: API and action-level rate limiting
- **Input Validation**: Zod schemas for all user inputs
- **SQL Injection**: Prisma ORM parameterized queries
- **File Uploads**: Type and size validation, S3 storage
- **Headers**: HSTS, X-Frame-Options, X-Content-Type-Options
- **Audit Logging**: All admin actions are logged

## Responsible Disclosure

We believe in responsible disclosure. We ask that you:

- Give us reasonable time to fix the issue before public disclosure
- Do not access or modify other users' data
- Do not degrade service availability
- Act in good faith to protect user privacy