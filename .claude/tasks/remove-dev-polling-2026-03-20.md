# Remove Dev Polling from useLivePlan Hook

**Created:** 2026-03-20
**Status:** open

## Context
During the UI design phase, a 3-second polling interval was added to the `useLivePlan` hook so that edits to plan `.md` files are automatically reflected in the UI without manual page reloads. This is a dev-only convenience and should not ship to production.

## Scope
- Remove the `setInterval` polling from `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_hooks/useLivePlan.ts`
- Replace the filesystem API (`/api/plans/[epicId]`) with proper Convex reactive queries (`useQuery`) once GitHub Sync (Feature 4) is implemented
- Delete the API route at `src/app/api/plans/[epicId]/route.ts` when no longer needed

## Notes
- The polling line is marked with a `// DEV ONLY` comment for easy identification
- This task is blocked by Feature 4 (GitHub Sync) — the Convex queries for epics/tickets need to exist before removing the filesystem fallback
