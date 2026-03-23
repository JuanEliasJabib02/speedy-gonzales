# Add Analytics Convex Queries

**Status:** review
**Priority:** high
**Agent:** Perro salchicha 🌭

## What it does

Create Convex queries that aggregate ticket and loop cycle data for the analytics dashboard. All computed at query time — no ETL.

## Checklist

- [x] Create `convex/analytics.ts` with the following queries:
- [x] `getTicketAnalytics({ projectId, from, to })` — returns:
  - `totalCompleted` (number)
  - `cleanApprovals` (number)
  - `withFixes` (number)
  - `blocked` (number)
  - `avgResolutionTimeMs` (number, avg of reviewAt - startedAt)
  - `qualityRate` (cleanApprovals / totalCompleted * 100)
  - `successRate` (totalCompleted / (totalCompleted + blocked) * 100)
- [x] `getTicketsByDay({ projectId, from, to })` — returns array of `{ date, clean, withFixes, blocked }` for charting
- [x] `getResolutionTimeTrend({ projectId, from, to })` — returns array of `{ date, avgMs }` for line chart
- [x] `getLoopHealthStats({ projectId, from, to })` — returns:
  - `totalCycles` (number)
  - `activeCycles` (not idle)
  - `idleCycles`
  - `rateLimitHits`
  - `modelBreakdown` ({ opus: number, sonnet: number })
- [x] All queries require auth and verify project ownership
- [x] Date range filter: `from` and `to` as timestamps (milliseconds)

## Files

- `convex/analytics.ts` (NEW)

## Commits

- `feat(analytics): add Convex analytics queries`
