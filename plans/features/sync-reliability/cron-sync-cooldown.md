# Add Cooldown to Cron Sync

**Status:** review
**Priority:** medium
**Agent:** Perro salchicha 🌭

## What it does

`syncAllProjects` schedules a sync for every project in the DB every 15 minutes, even if they were just synced via webhook. Fix: only sync projects that haven't been synced recently.

## Checklist

- [x] Add a `lastSyncedAt` timestamp field to the projects schema (if not already present)
- [x] In `syncAllProjects`: skip projects where `lastSyncAt` is within the last 15 minutes
- [x] Update `lastSyncAt` at the end of each successful sync (both webhook and cron triggered)
- [x] Skip unnecessary `completedTicketCount` patches in `upsertPlans` — only patch when value actually changed

## Files

- `convex/githubSync.ts`
- `convex/crons.ts`
- `convex/schema/projects.ts`

## Commits
- `521c80bb1f4de381358bee33718820709ec04326`
