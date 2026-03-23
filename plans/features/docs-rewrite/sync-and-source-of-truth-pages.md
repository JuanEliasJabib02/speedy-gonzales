# Update Sync + Source of Truth Pages

**Status:** todo
**Priority:** medium
**Agent:** Charizard 🔥

## What it does

Update the GitHub Auto-Sync and Source of Truth documentation pages. Both exist and have good bones but need to be updated to reflect the current architecture: webhook sync, Convex as read cache (not source of truth), the HTTP status endpoint, and how the autonomous loop interacts with sync.

## Checklist

- [ ] Rewrite source-of-truth page: emphasize git is truth for PLANS, Convex is truth for STATUS (this is a dual model now). Explain why: status changes need to be real-time (kanban), but plan content lives in git.
- [ ] Add diagram showing the data flow: repo `.md` files → webhook → Convex sync → UI display. And separately: autonomous loop → HTTP endpoint → Convex status update → UI display.
- [ ] Rewrite sync page: explain webhook setup (same as setup guide but with more technical detail), what triggers a sync, what gets synced (only files under `plansPath`), what the sync does (upsert epics + tickets, parse frontmatter, track checklist progress)
- [ ] Add section on manual sync: the "Sync now" button in the UI, and the manual curl command for triggering sync
- [ ] Add section on the `/update-ticket-status` endpoint — how the autonomous loop updates status in real-time without waiting for git push + webhook
- [ ] Remove any references to chat or AI-in-the-UI features (these were removed)

## Files

- `src/app/[locale]/(public-routes)/docs/sync/page.tsx` — update content
- `src/app/[locale]/(public-routes)/docs/source-of-truth/page.tsx` — update content

## Patterns to follow

- Reference: current sync page — keep the section structure
- Reference: `convex/http.ts` — the webhook handler and status endpoint are the technical source of truth
- Reference: `convex/githubSync.ts` — the sync logic

## UI Contract

- Layout: vertical sections with diagrams (ASCII art in code blocks), explanation text
- States: static content
- Reuse: same doc page pattern
- Match: existing docs pages
- Tokens: standard docs tokens, code blocks for API examples and curl commands
