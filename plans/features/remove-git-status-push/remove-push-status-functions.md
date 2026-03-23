# Remove pushStatusToGitHub Functions

**Status:** todo
**Priority:** high
**Agent:** Perro salchicha 🌭

## What it does

Delete `pushTicketStatusToGitHub`, `pushEpicStatusToGitHub`, and the shared `pushStatusToGitHub` helper from `convex/githubSync.ts`. Remove all callers. Status changes now go through Convex only — no need to push back to git.

## Checklist

- [ ] Delete `pushStatusToGitHub` helper function from `convex/githubSync.ts`
- [ ] Delete `pushTicketStatusToGitHub` internal action from `convex/githubSync.ts`
- [ ] Delete `pushEpicStatusToGitHub` internal action from `convex/githubSync.ts`
- [ ] Remove all `ctx.scheduler.runAfter` calls that schedule these functions (search entire `convex/` directory)
- [ ] Remove from `convex/tickets.ts` — any call to `pushTicketStatusToGitHub` after status update
- [ ] Remove from `convex/epics.ts` — any call to `pushEpicStatusToGitHub` after status update
- [ ] Clean up any unused imports after removal
- [ ] Verify `npx tsc --noEmit` passes with no errors

## Files

- `convex/githubSync.ts`
- `convex/tickets.ts`
- `convex/epics.ts`
