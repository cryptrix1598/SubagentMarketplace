# API Reference

Claude Agent Hub provides a RESTful API for programmatic access.

## Base URL

```
https://claudeagenthub.dev/api
```

## Authentication

All authenticated endpoints require a session token via Better Auth.

```bash
curl -H "Authorization: Bearer <token>" https://claudeagenthub.dev/api/agents
```

## Endpoints

### Agents

#### List Agents

```
GET /api/agents
```

Query Parameters:
- `q` — Search query
- `category` — Filter by category
- `sort` — Sort order (trending, newest, popular, most-downloaded, most-starred)
- `page` — Page number (default: 1)
- `pageSize` — Items per page (default: 24, max: 100)
- `verified` — Verified only (boolean)

#### Get Agent

```
GET /api/agents/:publisher/:slug
```

#### Publish Agent

```
POST /api/agents
```

Body:
```json
{
  "name": "My Agent",
  "slug": "my-agent",
  "description": "Description here",
  "category": "coding",
  "tags": ["test", "automation"],
  "license": "MIT",
  "version": "1.0.0"
}
```

#### Update Agent

```
PATCH /api/agents/:id
```

#### Delete Agent

```
DELETE /api/agents/:id
```

### Reviews

#### Create Review

```
POST /api/agents/:agentId/reviews
```

Body:
```json
{
  "rating": 5,
  "comment": "Excellent agent!"
}
```

#### Update Review

```
PATCH /api/reviews/:id
```

#### Delete Review

```
DELETE /api/reviews/:id
```

### Stars

#### Toggle Star

```
POST /api/agents/:agentId/star
```

### Forks

#### Fork Agent

```
POST /api/agents/:agentId/fork
```

### Users

#### Get Profile

```
GET /api/users/:username
```

#### Update Profile

```
PATCH /api/users/profile
```

### Organizations

#### Create Organization

```
POST /api/organizations
```

#### Get Organization

```
GET /api/organizations/:slug
```

#### Invite Member

```
POST /api/organizations/:id/members
```

### Collections

#### Create Collection

```
POST /api/collections
```

#### Get Collection

```
GET /api/collections/:id
```

### Bundles

#### Create Bundle

```
POST /api/bundles
```

#### Get Bundle

```
GET /api/bundles/:id
```

### Search

#### Search Agents

```
GET /api/search?q=query&category=coding&sort=trending
```

## Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| General API | 100 requests | 1 minute |
| Publishing | 10 requests | 1 hour |
| Reviews | 20 requests | 1 hour |
| Authentication | 5 requests | 1 minute |

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

Common error codes:
- `UNAUTHORIZED` — Authentication required
- `FORBIDDEN` — Insufficient permissions
- `NOT_FOUND` — Resource not found
- `VALIDATION_ERROR` — Invalid input
- `RATE_LIMIT` — Rate limit exceeded
- `CONFLICT` — Duplicate resource
- `INTERNAL` — Server error