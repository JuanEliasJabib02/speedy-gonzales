# Add Index for Autonomous Loop Projects

**Status:** todo
**Priority:** medium
**Agent:** Perro salchicha 🌭

## What it does

`getActiveLoopProjects` fetches ALL projects and filters in memory for `autonomousLoop === true`. Add a Convex index so the query only reads matching projects.

## Checklist

- [ ] Add index `by_autonomous_loop` on `projects` table: `["autonomousLoop"]`
- [ ] Update `getActiveLoopProjects` to use `.withIndex("by_autonomous_loop", q => q.eq("autonomousLoop", true))`
- [ ] Update `getAllActiveProjects` similarly if it also does a full scan
- [ ] Verify indexes are deployed correctly with `npx convex dev`

## Files

- `convex/schema/projects.ts`
- `convex/projects.ts`
