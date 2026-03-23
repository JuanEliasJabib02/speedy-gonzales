# Make Branch Prefix Configurable

**Status:** in-progress
**Priority:** low
**Agent:** Perro salchicha 🌭

## What it does

`useLivePlan` hardcodes `feature/` as the branch prefix for commit timeline. The actual project might use `feat/` or other conventions. Make it configurable or derive from project settings.

## Checklist

- [ ] Add a `branchPrefix` field to the project settings (default: `feat/`)
- [ ] In `useLivePlan`: use `project.branchPrefix` instead of hardcoded `feature/`
- [ ] Update `ConcurrencySettings` or `ProjectHeader` to allow editing the branch prefix
- [ ] Fallback to `feat/` if not set

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_hooks/useLivePlan.ts`
- `convex/schema/projects.ts`
- `convex/projects.ts`
