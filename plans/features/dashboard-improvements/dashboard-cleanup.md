# Dashboard Cleanup

**Status:** review
**Priority:** medium
**Agent:** Charizard 🔥

## What it does

Removes dead code and refactors the dashboard page to follow the project's architecture conventions:
1. Delete `_constants/mock-data.ts` — no longer used, everything comes from Convex
2. Extract a `useDashboard` composer hook from `page.tsx` — moves `useQuery` + `useState` out of the page component per the project's hook architecture rules

## Checklist

- [x] Delete `src/app/[locale]/(app)/dashboard/_constants/mock-data.ts`
- [x] Delete the `_constants/` directory if empty after removal
- [x] Create `src/app/[locale]/(app)/dashboard/_hooks/useDashboard.ts` — composer hook that wraps `useQuery(api.projects.getProjectsWithStats)` (from ticket project-stats-query) and `useState` for dialog state
- [x] Update `page.tsx` to use `useDashboard()` instead of inline hooks — page should only compose hooks + components
- [x] Ensure no imports reference the deleted mock-data file anywhere in the codebase

## Files

- `src/app/[locale]/(app)/dashboard/_constants/mock-data.ts` (delete)
- `src/app/[locale]/(app)/dashboard/_hooks/useDashboard.ts` (new)
- `src/app/[locale]/(app)/dashboard/page.tsx`
