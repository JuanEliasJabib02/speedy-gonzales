# Analytics Dashboard

**Status:** in-progress
**Priority:** high

## Overview

Add an Analytics tab to the project view that shows agent performance, quality metrics, and loop health over time. Filterable by time range (week/month/year).

This is a chained feature — tickets must be completed in order since later tickets depend on schema changes from earlier ones. All go on one branch, one PR.

## Key metrics

**Agent Performance:**
- Avg resolution time (startedAt → reviewAt)
- Clean approval rate (approved without fixes / total completed)
- Block rate (blocked / total processed)

**Loop Health:**
- Total cycles, active vs idle
- Rate limit hits (Opus vs Sonnet fallback)
- Model usage breakdown

## Architecture decisions

- Timestamps (`startedAt`, `reviewAt`, `completedAt`) added to tickets schema
- `completionType` field: `"clean"` | `"with-fixes"` on tickets
- `loopCycles` table for loop health tracking
- Analytics computed at query time (no ETL) — Convex queries aggregate ticket data
- Time filter: Week (default) | Month | Year
- Per-project view with "All Projects" option
- Charts: recharts library (already common in Next.js projects)
- Old tickets (before schema update) don't appear in analytics — clean slate

## Ticket order (chained)

1. Add analytics timestamps to ticket schema
2. Split approve button into "Approve" and "Approve with fixes"
3. Add loop cycles tracking table + update autonomous-loop
4. Add analytics Convex queries (aggregation)
5. Build analytics dashboard UI (tab, cards, charts)

## Still needs

- [ ] Analytics timestamps on tickets
- [ ] Split approve button
- [ ] Loop cycles tracking
- [ ] Analytics queries
- [ ] Dashboard UI
