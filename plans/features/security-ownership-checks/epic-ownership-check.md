# Add Ownership Check to Epic Mutations and Queries

**Status:** in-progress
**Priority:** critical
**Agent:** Perro salchicha 🌭

## What it does

Ensures `epics.updateStatus` and `epics.getEpic` verify that the epic belongs to a project owned by the current user.

## Checklist

- [ ] In `epics.updateStatus`: after `requireAuth`, fetch the epic, then the project
- [ ] Verify `project.userId === userId` — throw `ConvexError` with code `FORBIDDEN` if not
- [ ] In `epics.getEpic`: same ownership check before returning data
- [ ] Review all other public epic queries/mutations for the same pattern

## Files

- `convex/epics.ts`
