# Cron Fallback Sync

**Status:** todo
**Priority:** high
**Agent:** Charizard 🔥

## What it does

Adds a periodic Convex cron job that re-syncs all active projects every 15 minutes. This is a safety net — if a GitHub webhook fails (network blip, Convex downtime, GitHub outage), the cron ensures data catches up within 15 minutes instead of staying stale until the next git push.

The sync engine already uses content hashes to skip unchanged files, so no-op syncs are cheap.

## Checklist

- [ ] Create `convex/crons.ts` with a 15-minute interval job
- [ ] Create `syncAllProjects` internal action in `githubSync.ts` — queries all active projects and calls `syncRepoInternal` for each
- [ ] Ensure the sync guard (`syncStatus === "syncing"`) prevents overlaps between cron and webhook syncs
- [ ] Test: stop webhook, push a change, wait 15 min, verify sync happens

## Files

- `convex/crons.ts` (new)
- `convex/githubSync.ts`
