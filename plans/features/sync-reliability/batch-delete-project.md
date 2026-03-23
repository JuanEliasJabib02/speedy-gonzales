# Batch deleteProject Cascading Deletes

**Status:** review
**Priority:** medium
**Agent:** Perro salchicha 🌭

## What it does

`deleteProject` uses nested loops with sequential `ctx.db.delete()` calls. A project with many tickets easily hits Convex's 1000-operation limit. Fix: use scheduled mutations to batch the cleanup.

## Checklist

- [x] Refactor `deleteProject` to schedule a cleanup action instead of deleting inline
- [x] Cleanup action: delete tickets in batches (e.g. 100 per scheduled mutation), then epics, then the project
- [x] Or use `ctx.scheduler.runAfter` to chain: delete tickets batch → schedule next batch → when all tickets done → delete epics → delete project
- [x] Add a `deletionStatus` field or use `isDeleted` soft-delete on the project first, then clean up async

## Files

- `convex/projects.ts`
- `convex/schema/projects.ts`

## Commits

- `1a32a3ee28a3e7256f78903794f6e469fe2e7d75`
