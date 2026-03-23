# Batch deleteProject Cascading Deletes

**Status:** todo
**Priority:** medium
**Agent:** Perro salchicha 🌭

## What it does

`deleteProject` uses nested loops with sequential `ctx.db.delete()` calls. A project with many tickets easily hits Convex's 1000-operation limit. Fix: use scheduled mutations to batch the cleanup.

## Checklist

- [ ] Refactor `deleteProject` to schedule a cleanup action instead of deleting inline
- [ ] Cleanup action: delete tickets in batches (e.g. 100 per scheduled mutation), then epics, then the project
- [ ] Or use `ctx.scheduler.runAfter` to chain: delete tickets batch → schedule next batch → when all tickets done → delete epics → delete project
- [ ] Add a `deletionStatus` field or use `isDeleted` soft-delete on the project first, then clean up async

## Files

- `convex/projects.ts`
