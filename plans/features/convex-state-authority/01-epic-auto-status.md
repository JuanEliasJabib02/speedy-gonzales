# Auto-calculate Epic Status from Tickets

**Status:** todo
**Priority:** high
**Agent:** Charizard 🔥

## What it does

After any ticket status change, Convex automatically recalculates the parent epic's status, progress counts, and timestamps. No agent or webhook needed — it's a side effect of the ticket mutation.

## Checklist

- [ ] Create `convex/lib/epicStatusEngine.ts` — pure function that takes an array of ticket statuses and returns the epic status:
  - ALL tickets `completed` → epic `completed`
  - ALL tickets `completed` or `review` (at least one `review`) → epic `review`
  - ANY ticket `in-progress` → epic `in-progress`
  - ANY ticket `blocked` AND none `in-progress` → epic `blocked`
  - ALL tickets `todo` → epic `todo`
  - Mixed with at least one `in-progress` → epic `in-progress`
- [ ] Update `convex/tickets.ts` `updateStatusInternal` mutation — after updating ticket status, query all sibling tickets in the same epic, run the status engine, and patch the epic with: new status, `completedTicketCount`, `checklistCompleted` (sum of all tickets)
- [ ] Add `updatedAt` field to epics schema if not present — set it on every status recalculation
- [ ] Add unit-style test function `testEpicStatusEngine` in `convex/lib/epicStatusEngine.ts` — export the pure function so it can be tested independently

## Files

- `convex/lib/epicStatusEngine.ts` — NEW: pure status calculation logic
- `convex/schema/epics.ts` — add `updatedAt` field if missing
- `convex/tickets.ts` — modify `updateStatusInternal` to trigger epic recalculation

## Patterns to follow

- Reference: `convex/tickets.ts` → `updateStatusInternal` — this is where ticket status changes happen, add epic recalc here
- Reference: `convex/schema/epics.ts` → existing fields like `completedTicketCount` — we're updating these automatically now
