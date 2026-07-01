# Architecture

## Stack

| Layer | Technology | Hosting | Cost |
|---|---|---|---|
| Frontend | Next.js (React) | Vercel | $0 |
| Backend | Next.js API Routes | Vercel Serverless | $0 |
| Database | PostgreSQL | Supabase | $0 |
| Auth | Supabase Auth | Supabase | $0 |
| File Storage | Supabase Storage | Supabase | $0 |
| CI/CD | GitHub Actions | GitHub | $0 |
| Domain | sonneark.eu | existing | $0 |

First real cost threshold: Supabase Pro ($25/month) when project has proven adoption.

## Principles

- Mobile-first — the game is played on mobile, the website must work on mobile in under 3 seconds
- Ship working software — 80% done and deployed beats 100% done and waiting
- Backlog over bloat — new ideas go into the backlog, not the current sprint
- Manual before automated — prove demand before building pipelines

## What this replaces

- PHP + cPanel hosting → Vercel + Supabase
- 3-repo separation → single repo with branch protection
- Promotion packages → standard PR review
- Complex Workbench governance → GitHub Issues + Milestones

## What carries over

- Design system (site.css) — reused as CSS Modules or reference for Tailwind
- Guide content — migrated as structured content
- Multilingual architecture — preserved
- Domain sonneark.eu — DNS pointed to Vercel
