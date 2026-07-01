# Architecture

## Stack

| Layer | Technology | Hosting | Cost |
|---|---|---|---|
| Frontend | React (Vite) — static build | cPanel (existing) | $0 |
| Backend | PHP REST API | cPanel (existing) | $0 |
| Database | MySQL | cPanel (existing) | $0 |
| Auth | PHP sessions + JWT | cPanel (existing) | $0 |
| CI/CD | GitHub Actions (build + deploy) | GitHub | $0 |
| Domain | sonneark.eu | existing | $0 |

No new hosting. No new services. Everything runs on elevenlive's existing cPanel.

## How it works

```
GitHub repo (React + PHP)
  → push to main
  → GitHub Actions builds React to /dist
  → deploys via git to cPanel
  → cPanel serves: index.html (React SPA) + /api/* (PHP)
```

React talks to the PHP API via fetch. PHP reads and writes MySQL. 
The domain and nameservers stay exactly as they are.

## Principles

- Mobile-first — the game is played on mobile, the website must work on mobile in under 3 seconds
- Ship working software — 80% done and deployed beats 100% done and waiting
- Backlog over bloat — new ideas go into the backlog, not the current sprint
- Manual before automated — prove demand before building pipelines

## What carries over

- Existing MySQL database and schema
- PHP for all backend logic and API routes
- cPanel git deployment (already in place)
- Domain and nameservers untouched
- Design system (site.css) as reference for React components
- Guide content — migrated as structured data
- Multilingual architecture — preserved

## What changes

- Frontend becomes React instead of PHP-rendered HTML
- No more mixed PHP/HTML templates — clean API separation
- TypeScript on the frontend for type safety
- GitHub Actions automates the build step before git deployment

## Future cost threshold

Only if the project outgrows cPanel:
- Vercel for React hosting ($0 → stays free longer)
- Supabase for database ($25/month Pro, only if MySQL on cPanel becomes a bottleneck)

These are not planned. They are escape hatches if needed.
