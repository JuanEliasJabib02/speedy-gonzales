# getProjects & getProject Queries

**Status:** todo
**Priority:** medium

## What it does

Convex queries to list all projects for the current user and get a single project by ID.

## Checklist

- [ ] `getProjects()` — query all projects where userId matches current user
- [ ] `getProject(projectId)` — query single project by ID, verify ownership
- [ ] Return computed fields: activeFeatures count, totalFeatures count, ticketCount
- [ ] Handle not-found case with proper error

## Notes

- Use `by_user` index for getProjects (no full table scan)
- getProject should verify the project belongs to the current user
