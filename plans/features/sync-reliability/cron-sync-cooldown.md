# Add Cooldown to Cron Sync

**Status:** in-progress
**Priority:** medium
**Agent:** Perro salchicha 🌭

## What it does

`syncAllProjects` schedules a sync for every project in the DB every 15 minutes, even if they were just synced via webhook. Fix: only sync projects that haven't been synced recently.

## Checklist

- [ ] Add a `lastSyncedAt` timestamp field to the projects schema (if not already present)
- [ ] In `syncAllProjects`: skip projects where `lastSyncedAt` is within the last 15 minutes
- [ ] Update `lastSyncedAt` at the end of each successful sync (both webhook and cron triggered)
- [ ] Skip unnecessary `completedTicketCount` patches in `upsertPlans` — only patch when value actually changed

## Files

- `convex/githubSync.ts`
- `convex/crons.ts`
- `convex/schema/projects.ts`
