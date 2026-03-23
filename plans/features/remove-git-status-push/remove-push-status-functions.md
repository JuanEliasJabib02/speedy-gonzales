# Remove pushStatusToGitHub Functions

**Status:** review
**Priority:** high
**Agent:** Perro salchicha 🌭

## What it does

Delete `pushTicketStatusToGitHub`, `pushEpicStatusToGitHub`, and the shared `pushStatusToGitHub` helper from `convex/githubSync.ts`. Remove all callers. Status changes now go through Convex only — no need to push back to git.

## Checklist

- [x] Delete `pushStatusToGitHub` helper function from `convex/githubSync.ts`
- [x] Delete `pushTicketStatusToGitHub` internal action from `convex/githubSync.ts`
- [x] Delete `pushEpicStatusToGitHub` internal action from `convex/githubSync.ts`
- [x] Remove all `ctx.scheduler.runAfter` calls that schedule these functions (search entire `convex/` directory)
- [x] Remove from `convex/tickets.ts` — any call to `pushTicketStatusToGitHub` after status update
- [x] Remove from `convex/epics.ts` — any call to `pushEpicStatusToGitHub` after status update (none found — no changes needed)
- [x] Clean up any unused imports after removal
- [x] Verify `npx tsc --noEmit` passes with no errors (2 pre-existing errors unrelated to this change)

## Files

- `convex/githubSync.ts`
- `convex/tickets.ts`
