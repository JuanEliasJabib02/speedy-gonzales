# Project Stats Query

**Status:** review
**Priority:** high
**Agent:** Charizard 🔥

## What it does

Creates a new Convex query that returns ticket counts grouped by status for a given project. This powers the dashboard cards with real progress data instead of showing nothing.

The query joins projects → epics → tickets and returns counts per status (todo, in-progress, review, completed, blocked) plus the total.

## Checklist

- [x] Create `getProjectStats` query in `convex/projects.ts` — takes `projectId`, returns `{ todo: number, inProgress: number, review: number, completed: number, blocked: number, total: number }`
- [x] Query must use indexes: `epics.by_project` → `tickets.by_epic`, then count by status in memory
- [x] Create `getProjectsWithStats` query that returns all user projects with their stats in a single query (avoids N+1 from dashboard calling getProjectStats per project)
- [x] Add return type to the query so the frontend gets typed data

## Files

- `convex/projects.ts`
