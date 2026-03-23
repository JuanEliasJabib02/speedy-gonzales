# Add Status Value Validation

**Status:** in-progress
**Priority:** high
**Agent:** Perro salchicha 🌭

## What it does

`tickets.updateStatus` and `epics.updateStatus` accept any string as a status value. Fix: validate against the allowed status values (`todo`, `in-progress`, `review`, `completed`, `blocked`) in all paths.

## Checklist

- [ ] Create a shared `VALID_STATUSES` constant: `["todo", "in-progress", "review", "completed", "blocked"]`
- [ ] In `tickets.updateStatus` mutation: validate status is in `VALID_STATUSES`, throw `ConvexError` with code `INVALID_STATUS` if not
- [ ] In `epics.updateStatus` mutation: same validation
- [ ] In `updateTicketStatusInternal` (HTTP endpoint path): validate status before patching
- [ ] Create a shared `VALID_PRIORITIES` constant too: `["low", "medium", "high", "critical"]`

## Files

- `convex/tickets.ts`
- `convex/epics.ts`
- `convex/helpers.ts` (for shared constants)
- `convex/http.ts`
