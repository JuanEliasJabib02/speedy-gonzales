# Use Union Literal Types in Convex Schema

**Status:** todo
**Priority:** medium
**Agent:** Perro salchicha 🌭

## What it does

All status and priority fields in the schema use `v.string()`. Fix: use `v.union(v.literal(...))` so Convex validates values at the database level.

## Checklist

- [ ] Define shared status union: `v.union(v.literal("todo"), v.literal("in-progress"), v.literal("review"), v.literal("completed"), v.literal("blocked"))`
- [ ] Define shared priority union: `v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("critical"))`
- [ ] Apply to `convex/schema/tickets.ts` — `status` and `priority` fields
- [ ] Apply to `convex/schema/epics.ts` — `status` and `priority` fields
- [ ] Apply to `convex/schema/projects.ts` — `syncStatus` field: `v.union(v.literal("idle"), v.literal("syncing"), v.literal("error"))`
- [ ] Export the union types from a shared `convex/schema/shared.ts` or `convex/helpers.ts`
- [ ] Update `gitProvider` field to use `v.union(v.literal("github"), v.literal("bitbucket"))` if applicable

## Files

- `convex/schema/tickets.ts`
- `convex/schema/epics.ts`
- `convex/schema/projects.ts`
- `convex/helpers.ts`
