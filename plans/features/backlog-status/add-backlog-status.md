# Add Backlog Status to Schema and Validators

**Status:** review
**Priority:** high
**Agent:** Perro salchicha 🌭

## What it does

Add `backlog` as a valid status for tickets and epics. Update all validators, constants, and styling maps.

## Checklist

- [x] Add `"backlog"` to `VALID_STATUSES` in `convex/model/parsePlan.ts`
- [x] Add `"backlog"` to HTTP endpoint status validation in `convex/http.ts`
- [x] Add backlog styling to `STATUS_PILL` and `STATUS_DOT` maps in `PlanViewer.tsx` — uses `status-backlog` CSS variable (neutral gray)
- [x] Add "Backlog" option to `STATUS_OPTIONS` in `PlanViewer.tsx` (before "Todo")
- [x] Add `backlog` to kanban config (`FeatureStatus` type, `STATUS_CONFIG`, `ACTIVE_COLUMNS`)
- [x] Add `--status-backlog` CSS variable to dark and light themes in `globals.css`
- [x] Add `backlog` to type casts in `useLivePlan.ts` and `page.tsx`
- [x] Update schema comments in `tickets.ts` and `epics.ts`
- [x] Add `backlog` count to `getProjectStats` in `convex/projects.ts`
- [x] Verify the loop query (`getTodoTicketsByProject`) only fetches `todo` tickets — confirmed, backlog is skipped

## Files

- `convex/model/parsePlan.ts`
- `convex/http.ts`
- `convex/projects.ts`
- `convex/schema/tickets.ts`
- `convex/schema/epics.ts`
- `src/styles/globals.css`
- `src/app/[locale]/(app)/projects/[projectId]/_constants/kanban-config.ts`
- `src/app/[locale]/(app)/projects/[projectId]/page.tsx`
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/PlanViewer.tsx`
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_hooks/useLivePlan.ts`

## Commits
- `61a611b37e6b76603645d2be4dd67aa1bb5fa7d4`
