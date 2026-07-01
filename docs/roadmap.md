# Roadmap

## Phase 1 — Foundation (MVP)

Goal: a working website that guild members actually use on mobile.

- Next.js project setup, Supabase connected, domain live
- Guide reading — mobile-optimized, fast, searchable
- Operations page — event timers, R4/R5 roster, event progress (officer-managed)
- Guild event scheduling — officers set time for the 2 guild-controlled events
- Polls — event time voting, results with percentages
- Dark/light theme

Delivery: working system, no accounts required for public content.

## Phase 2 — Member Layer

Goal: members have an identity on the platform.

- Registration and login (Supabase Auth)
- Member profile
- Bookmarks and personal checklists
- Guide comments and suggestions
- Notifications (guide updates, event reminders)

Delivery: members can log in and interact.

## Phase 3 — Officer Tools

Goal: officers can manage content without developer involvement.

- Admin interface for event timers, roster, progress
- Guide draft and publish workflow
- Forum basics
- Moderation tools
- Readiness calculator (member self-inputs key resource numbers, gets event recommendations)

Delivery: elevenlive can update the site himself.

## Phase 4 — Game Intel (only if Phase 1-3 prove adoption)

Goal: reduce manual data entry where it is a proven bottleneck.

- Manual officer entry for member rankings/scores
- Evaluate screenshot-based OCR for leaderboard data only
- Assess actual usage before building any automated pipeline

Trigger: manual entry is demonstrably too slow for real officer workflows.

## Backlog (no phase assigned)

- Neural network for screenshot analysis
- PC companion app for inventory data
- Discord bot integration
- Alliance-visible content layer
- Mentorship directory
- Squad/team planner
- Officer handover log
- Game-intel quarantine and review pipeline
- Backup/recovery center

These items are only worth building if the platform has proven active use.
