# Wire Kanban to Convex

**Status:** todo
**Priority:** medium

## What it does

Replace mock features with real Convex queries. The kanban should show epics from the database, grouped by status.

## Checklist

- [ ] Create `useProjectKanban` hook
- [ ] Use `useQuery(api.epics.getByProject, { projectId })` for features
- [ ] Group features by status for columns
- [ ] Handle loading state
- [ ] Handle empty state (no synced features)
- [ ] Remove mock data imports
- [ ] Optional: drag & drop to change feature status
