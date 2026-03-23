# Add Loop Cycles Tracking Table

**Status:** todo
**Priority:** high
**Agent:** Perro salchicha 🌭

## What it does

Create a `loopCycles` table in Convex to track every autonomous loop execution. This powers the "Loop Health" section of the analytics dashboard.

## Checklist

- [ ] Create `convex/schema/loopCycles.ts` with table: `projectId` (id), `timestamp` (number), `ticketsProcessed` (number), `ticketsSkipped` (number), `wasIdle` (boolean), `rateLimitHit` (boolean), `modelUsed` (optional string: "opus" | "sonnet"), `durationMs` (optional number)
- [ ] Add index `by_project_timestamp` on `[projectId, timestamp]`
- [ ] Create `convex/loopCycles.ts` with:
  - `logCycle` internal mutation — called by the loop after each cycle
  - `getCycleStats` query — aggregates cycles for a project within a date range
- [ ] Register the table in the main schema file
- [ ] The autonomous-loop skill should call `logCycle` at the end of each run (via HTTP endpoint or direct mutation)
- [ ] Add HTTP endpoint `POST /log-loop-cycle` that accepts cycle data and writes to the table (auth with LOOP_API_KEY)

## Files

- `convex/schema/loopCycles.ts` (NEW)
- `convex/loopCycles.ts` (NEW)
- `convex/http.ts`
- `convex/schema.ts` (register new table)
