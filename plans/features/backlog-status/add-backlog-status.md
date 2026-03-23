# Add Backlog Status to Schema and Validators

**Status:** in-progress
**Priority:** high
**Agent:** Perro salchicha 🌭

## What it does

Add `backlog` as a valid status for tickets and epics. Update all validators, constants, and styling maps.

## Checklist

- [ ] Add `"backlog"` to `VALID_STATUSES` in `convex/helpers.ts`
- [ ] Add `v.literal("backlog")` to the status union validator in `convex/helpers.ts`
- [ ] Add backlog styling to `STATUS_PILL` and `STATUS_DOT` maps in `src/lib/constants/status-styles.ts` — use a neutral/gray color (e.g. `bg-muted text-muted-foreground`)
- [ ] Add "Backlog" option to `STATUS_OPTIONS` in `PlanViewer.tsx` (before "Todo")
- [ ] Verify the loop query in `convex/projects.ts` (`getActiveLoopProjects`) only fetches `todo` tickets — it should already skip `backlog` but confirm

## Files

- `convex/helpers.ts`
- `src/lib/constants/status-styles.ts`
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/PlanViewer.tsx`
