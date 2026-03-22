# Epic Auto-Promote on Sync

**Status:** review
**Priority:** high
**Agent:** Charizard 🔥

## What it does

Auto-promotes an epic to `review` when all its tickets are either `completed` or `review`. This runs in two paths:

1. **Webhook sync path** (`upsertPlans`) — after syncing tickets from git, checks if all tickets in the epic are done and promotes
2. **Kanban drag path** (`updateStatus`) — when a ticket is moved to `review` or `completed` via the UI, checks the same condition

Previously, the auto-promote only triggered from the kanban path and only checked for `completed` status. Now it also triggers from the webhook sync and accepts `review` as a "done" state.

## Checklist

- [x] Relax condition in `tickets.ts` `updateStatus` to trigger on `review` OR `completed`
- [x] Add auto-promote check in `githubSync.ts` `upsertPlans` after upserting each epic's tickets
- [x] Test: all tickets in review → epic auto-promotes to review

## Files

- `convex/tickets.ts`
- `convex/githubSync.ts`
