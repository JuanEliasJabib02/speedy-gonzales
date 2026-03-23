# Prevent upsertPlans from Hitting Operation Limit

**Status:** todo
**Priority:** medium
**Agent:** Perro salchicha 🌭

## What it does

`upsertPlans` does N epic queries + N ticket queries + N patches/inserts + final collect + soft-delete patches in a single mutation. Large repos easily exceed 1000 ops. Fix: batch the upsert or split into multiple scheduled mutations.

## Checklist

- [ ] Measure current op count for a typical sync (log it in dev)
- [ ] If epic+ticket count > threshold (~100 total), split into batched scheduled mutations
- [ ] Each batch processes a subset of epics/tickets, then schedules the next batch
- [ ] Ensure the `syncStatus` remains "syncing" across all batches and only resets on completion/error

## Files

- `convex/githubSync.ts`
