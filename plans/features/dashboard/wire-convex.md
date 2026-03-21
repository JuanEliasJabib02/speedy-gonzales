# Wire Dashboard to Convex

**Status:** in-progress

## What it does

Replace mock data with real Convex queries. The dashboard should show real projects from the database.

## Checklist

- [ ] Create `useDashboard` hook
- [ ] Use `useQuery(api.projects.getProjects)` for project list
- [ ] Use `useMutation(api.projects.createProject)` in dialog
- [ ] Handle loading state (skeleton or spinner)
- [ ] Handle error state
- [ ] Remove mock data imports

## Notes

- Projects should load reactively — creating a project updates the grid in real-time
- The dialog should close and reset on successful creation
