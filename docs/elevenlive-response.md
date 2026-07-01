# Response To elevenlive Feedback

Status: draft response to elevenlive's architecture and collaboration feedback  
Date: 2026-07-02

---

## What we agree with

- PHP remains the backend authority — auth, sessions, permissions, storage, data safety.
- The API contract approach is the right collaboration boundary.
- Mock-first frontend development, no live data, no production credentials.
- Flat-file storage is not casually replaced.
- MySQL only where it adds value.
- Phase 0 discovery export before implementation is the correct first step.
- Session cookies with `HttpOnly`, `Secure`, `SameSite=Strict`.
- Rate limiting and generic auth error messages.
- Promotion packages before anything reaches production.

---

## One open question that needs your explicit answer

**PHP templates.**

Your documents recommend "PHP routes/pages for core navigation" and "PHP renders base pages."

Our proposal is different: **PHP becomes a pure REST API. No HTML templates. No PHP-rendered pages.**

React is the complete frontend — everything the user sees. PHP owns all auth, permissions, data and security checks. If React fails to load, the user sees nothing — but PHP still enforces all permissions on every API call, which is the part that matters.

This does not weaken the security model. PHP is still the authority. It just does not generate HTML anymore.

The reason: you described the current PHP UI as the problem we are solving. Building a React frontend on top of PHP templates means maintaining two rendering layers simultaneously. There is no benefit to keeping PHP templates once React is the frontend.

**Please confirm: is PHP as a pure REST API (no HTML templates) acceptable to you?**

If yes, the architecture is clean and simple:

```
sonneark.eu
  /          React SPA (static files, deployed from frontend repo)
  /api/*     PHP REST API (auth, data, permissions)
```

If no, tell us why — we will adjust.

---

## On "production authority" and the frontend repo

We want to be explicit about what "no production authority" means and what it does not mean.

**What it means:**

- You control the deploy button.
- The frontend repo never deploys directly to `sonneark.eu`.
- No secrets, no live data, no production config in the frontend repo.
- Every feature goes through your review before it reaches real users.

**What it does not mean:**

- The React code is not throwaway. It is not a sandbox that no customer ever sees.
- You do not rewrite or copy anything. The React code Jessy writes **is** the production frontend.
- After your review, you deploy her static files to cPanel. Same code, your deploy button.

The process is the same as a normal PR review — you just hold the merge/deploy authority instead of it being automatic.

If "prototype" has caused confusion, we can rename the repo to `sonneark-frontend` and drop the prototype label entirely. The work there is production-quality code under review, not experiments.

---

## On CSRF tokens

Your security contract draft requires a CSRF token on every mutation endpoint.

We propose removing the separate CSRF token. `SameSite=Strict` on the session cookie already prevents CSRF on a dedicated domain like `sonneark.eu`. A cross-origin request from `evil.com` cannot carry the session cookie — the browser blocks it at the cookie level.

Adding a separate CSRF token would mean:
- A `GET /api/auth/csrf-token` endpoint
- React must fetch and store the token before every mutation
- Every mutation request must include an `X-CSRF-Token` header
- PHP must validate it on every mutation

This is significant complexity for zero additional security gain on a dedicated domain with `SameSite=Strict`. We have updated the API contract to reflect this.

If there is a specific threat scenario you are worried about that `SameSite=Strict` does not cover, let us know and we will reconsider.

---

## On the Intel repo

We are treating the Intel repo as out of scope until Phase 5+. No Intel-related work, no game data pipelines, no OCR. This phase does not exist until the core platform has proven active use.

---

## On the four-layer model

We understand and accept the four-layer model:

```
Prototype / frontend (Jessy)
  → Contract / Workbench (both)
  → Canonical website (elevenlive)
  → Intel (elevenlive, Phase 5+ only)
```

The only thing we want to confirm is the PHP-as-pure-API question above, because it affects everything we build in the frontend layer.

---

## Roadmap additions we are incorporating

From your feedback, we are adding to the roadmap:

- All-device support (mobile, tablet, desktop, keyboard navigation, zoom) — not only mobile-first
- Away / absence status (member self-marks, officer-visible, auto-expiry)
- All-events framework (Duel and Top 100 as templates, not the whole model)
- Extended translation scope (forum posts, notifications, not only guide text)
- Forum, suggestions, translation workflow endpoints added to the API contract
- Chat: acknowledged, deferred until after forum/moderation/notifications are stable

---

## On the API contract format

Your security-contract proposal asks for 19 fields per endpoint (storage authority, cache policy, test fixtures, direct-route test, fail-closed rule, etc.).

We have updated the contract with the four fields that are genuinely useful at this stage: `capability`, `scope`, `audit` and `fail_closed`. These appear as a `Security:` block on mutation and admin endpoints only. Simple read endpoints (GET /api/events, GET /api/guide, etc.) do not carry this block — the information would be obvious and repetitive.

The remaining fields from your list belong either on the PHP implementation side (storage authority, cache policy) or in a separate test plan document (fixtures, direct-route tests). Including them in the API contract would make it harder to read and maintain without adding value for the frontend developer consuming it.

---

## What we are not incorporating yet

- Security-contract YAML format per endpoint: we will move toward this incrementally, starting with the highest-risk endpoints (admin mutations). A full YAML contract for every endpoint before any UI work is built is too much upfront documentation cost for this stage.
- Promotion package format: accepted in principle, we will produce the first one when the first feature slice is ready for review.

---

## Suggested next step

Once you confirm the PHP-as-pure-API question, we will:

1. Finalise the architecture document.
2. Update the API contract with the missing endpoint areas (forum, suggestions, translation, away status, all-events).
3. Start the first mock-first feature slice for your review.

On your side, the most useful thing would be the sanitised discovery export — shapes and fixtures, no live data. That lets us build accurately without any production access.
