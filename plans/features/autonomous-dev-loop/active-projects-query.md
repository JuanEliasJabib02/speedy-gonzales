# Active Projects Query

**Status:** todo
**Priority:** critical
**Agent:** Charizard 🔥

## What it does

Create a Convex query that returns all projects eligible for the autonomous loop — where `autonomousLoop === true` and `localPath` is set. Also create a query to get todo tickets for a project, ordered by priority.

## Checklist

- [ ] Create `getActiveLoopProjects` internalQuery in `convex/projects.ts` — returns projects where `autonomousLoop === true` and `localPath` is not undefined/empty
- [ ] Create `getTodoTicketsByProject` internalQuery in `convex/tickets.ts` — returns tickets where `status === "todo"` for a given projectId, sorted by priority (critical → high → medium → low)
- [ ] Add priority sort helper: map priority string to number for ordering (critical=0, high=1, medium=2, low=3)

## Files

- `convex/projects.ts`
- `convex/tickets.ts`
