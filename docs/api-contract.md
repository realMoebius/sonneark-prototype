# API Contract

This document defines the boundary between the React frontend and the PHP backend.

The PHP backend (`elevenlive/sonneark-website`) must implement these endpoints.  
The React frontend (`realMoebius/sonneark-frontend`) must not assume anything beyond what is listed here.

---

## Conventions

- Base path: `/api/`
- All responses: `Content-Type: application/json`
- Authentication: PHP session cookie (`HttpOnly`, `Secure`, `SameSite=Strict`)
- Error shape: `{ "error": "human-readable message", "code": "MACHINE_CODE" }`
- Dates: ISO 8601 strings (`2026-07-01T18:00:00Z`)
- Permissions: enforced server-side on every endpoint — hiding a button in React is not a permission check

---

## Auth

### `POST /api/auth/login`

```
Request:  { "username": string, "password": string }
Response: { "user": User }
Errors:   401 INVALID_CREDENTIALS (generic — no account enumeration)
          429 RATE_LIMITED
```

### `POST /api/auth/logout`

```
Response: 204 No Content
```

### `POST /api/auth/register`

```
Request:  { "username": string, "password": string, "invite_code": string, "language": string, "timezone": string }
Response: { "user": User }
Errors:   400 VALIDATION_ERROR
          409 USERNAME_TAKEN (only if account enumeration policy allows this)
          429 RATE_LIMITED
```

### `GET /api/auth/me`

Returns the current session user. Called on app load.

```
Response: { "user": User } or 401 NOT_AUTHENTICATED
```

---

## Types

### User

```json
{
  "id": 1,
  "username": "jessy",
  "display_name": "Jessy",
  "avatar_url": "/uploads/avatars/1.webp",
  "language": "de",
  "timezone": "Europe/Berlin",
  "role": "member",
  "capabilities": ["translate", "guide_editor"]
}
```

**Roles:** `owner` | `admin` | `officer` | `moderator` | `member` | `suspended`

**Capabilities:** `translate` | `review_translations` | `guide_editor` | `publish_guide` | `event_manager` | `moderate` | `manage_users` | `manage_roles` | `intel_reviewer` | `backup_status` | `qa_tools`

---

## Guide

### `GET /api/guide`

Returns all guide sections the current user is permitted to see.

```
Response: { "sections": GuideSection[] }
```

### `GET /api/guide/:slug`

```
Response: { "section": GuideSection }
Errors:   404 NOT_FOUND
          403 FORBIDDEN
```

### GuideSection

```json
{
  "slug": "commerce-guild-duel",
  "title": "Commerce Guild Duel",
  "content_html": "<p>...</p>",
  "language": "de",
  "visibility": "public",
  "updated_at": "2026-06-15T10:00:00Z"
}
```

---

## Events

### `GET /api/events`

```
Response: { "current": Event | null, "upcoming": Event[] }
```

### `GET /api/events/:id`

```
Response: { "event": Event }
Errors:   404 NOT_FOUND
```

### Event

```json
{
  "id": 1,
  "title": "Commerce Guild Duel",
  "starts_at": "2026-07-04T10:00:00Z",
  "ends_at": "2026-07-10T10:00:00Z",
  "phase": 2,
  "type": "guild_duel",
  "officer_note": "Day 3–4: Operation Blackout active",
  "checklist": ["Save speedups", "Check AP", "Rally at 18:00 server time"]
}
```

`officer_note` is only present for users with `officer` role or higher.

---

## Roster

### `GET /api/roster`

```
Response: { "members": RosterEntry[] }
```

Requires: authenticated + `guild` visibility scope.

### RosterEntry

```json
{
  "id": 1,
  "display_name": "Commander X",
  "game_rank": "R4",
  "status": "active"
}
```

---

## Notifications

### `GET /api/notifications`

```
Response: { "unread_count": 3, "items": Notification[] }
```

### `POST /api/notifications/read/:id`

```
Response: 204 No Content
Errors:   404 NOT_FOUND
```

### `POST /api/notifications/read-all`

```
Response: 204 No Content
```

### Notification

```json
{
  "id": 42,
  "type": "guide_updated",
  "message": "Commerce Guild Duel guide was updated",
  "read": false,
  "created_at": "2026-07-01T09:00:00Z",
  "link": "/guide/commerce-guild-duel"
}
```

---

## Polls

### `GET /api/polls`

```
Response: { "polls": Poll[] }
```

### `GET /api/polls/:id`

```
Response: { "poll": Poll }
```

### `POST /api/polls/:id/vote`

```
Request:  { "option_id": number }
Response: { "poll": Poll }
Errors:   400 ALREADY_VOTED (if vote changes not allowed)
          403 POLL_CLOSED
          404 NOT_FOUND
```

### Poll

```json
{
  "id": 1,
  "question": "Best time for Commerce Guild Duel kick-off?",
  "status": "open",
  "my_vote": null,
  "options": [
    { "id": 1, "label": "18:00 server time", "votes": 12 },
    { "id": 2, "label": "20:00 server time", "votes": 7 }
  ],
  "closes_at": "2026-07-05T00:00:00Z"
}
```

`my_vote` is the `option_id` the current user voted for, or `null`.  
`votes` counts are only shown after voting or when `status` is `closed`.

---

## Readiness Calculator

### `GET /api/readiness/recommendations`

```
Request params: speedups=1200&ap=450&fragments=80&event_type=guild_duel
Response: { "recommendations": Recommendation[] }
```

Calculation happens server-side. No raw game data is stored unless the user saves their profile.

### `POST /api/readiness/profile`

Saves the user's current resource numbers to their profile.

```
Request:  { "speedups": number, "ap": number, "fragments": number }
Response: { "saved": true }
```

### Recommendation

```json
{
  "priority": "high",
  "action": "Save all speedups until Day 3",
  "reason": "Operation Blackout runs Day 3–4 — timing is critical"
}
```

---

## Admin (officer+ only)

### `GET /api/admin/users`

Requires: `manage_users` capability.

```
Response: { "users": User[] }
```

### `PATCH /api/admin/users/:id`

Requires: `manage_roles` capability.

```
Request:  { "role": string, "capabilities": string[] }
Response: { "user": User }
Errors:   403 FORBIDDEN
          409 LAST_OWNER_PROTECTED
```

### `GET /api/admin/audit-log`

Requires: `owner` role.

```
Response: { "entries": AuditEntry[] }
```

### AuditEntry

```json
{
  "id": 1,
  "actor": "elevenlive",
  "action": "role_grant",
  "target": "jessy",
  "detail": "granted guide_editor capability",
  "created_at": "2026-07-01T10:00:00Z"
}
```

---

## Open questions (Phase 0)

These endpoint shapes are drafts. Before implementation, elevenlive and Jessy need to confirm:

1. Session cookie name and domain scope
2. Language fallback chain (de → en → raw key?)
3. Visibility scopes: `public` | `alliance` | `guild` | `officer` | `owner` — exact list
4. Whether guide content is served as HTML, Markdown, or structured blocks
5. Flat-file vs MySQL for guide content — affects caching strategy
6. Pagination strategy for forum, audit log, notifications
7. Avatar URL format and CDN/path conventions
8. Whether event `phase` is a computed field or stored
