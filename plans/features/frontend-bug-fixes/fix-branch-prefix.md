# Make Branch Prefix Configurable

**Status:** review
**Priority:** low
**Agent:** Perro salchicha 🌭

## What it does

`useLivePlan` hardcodes `feature/` as the branch prefix for commit timeline. The actual project might use `feat/` or other conventions. Make it configurable or derive from project settings.

## Checklist

- [x] Add a `branchPrefix` field to the project settings (default: `feat/`)
- [x] In `useLivePlan`: use `project.branchPrefix` instead of hardcoded `feature/`
- [x] Update `ConcurrencySettings` or `ProjectHeader` to allow editing the branch prefix
- [x] Fallback to `feat/` if not set

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_hooks/useLivePlan.ts`
- `convex/schema/projects.ts`
- `convex/projects.ts`
- `src/app/[locale]/(app)/projects/[projectId]/_components/ConcurrencySettings.tsx`
- `src/app/[locale]/(app)/projects/[projectId]/_components/ProjectHeader.tsx`
- `src/app/[locale]/(app)/projects/[projectId]/page.tsx`

## Commits
- `0aaa68ec42d9bafe1e93f3717d44925b2c8e6bc5`
