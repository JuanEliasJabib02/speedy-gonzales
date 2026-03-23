# Add Index for Autonomous Loop Projects

**Status:** review
**Priority:** medium
**Agent:** Perro salchicha 🌭

## What it does

`getActiveLoopProjects` fetches ALL projects and filters in memory for `autonomousLoop === true`. Add a Convex index so the query only reads matching projects.

## Checklist

- [x] Add index `by_autonomous_loop` on `projects` table: `["autonomousLoop"]`
- [x] Update `getActiveLoopProjects` to use `.withIndex("by_autonomous_loop", q => q.eq("autonomousLoop", true))`
- [x] Update `getAllActiveProjects` similarly if it also does a full scan
- [ ] Verify indexes are deployed correctly with `npx convex dev`

## Files

- `convex/schema/projects.ts`
- `convex/projects.ts`

## Notes

- `getAllActiveProjects` returns all projects without filtering by `autonomousLoop`, so no index applies — left as-is.
- `npx convex dev` cannot run in this non-interactive environment; index will be created on next deploy.

## Commits

- `450179bcfe7da1322a88b54dfdc9e5abbd7cd99e`
