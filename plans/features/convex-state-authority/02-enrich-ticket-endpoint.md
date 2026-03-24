# Enrich /update-ticket-status Endpoint

**Status:** todo
**Priority:** high
**Agent:** Charizard 🔥

## What it does

Extend the existing `/update-ticket-status` HTTP endpoint to accept additional fields: commits, checklist progress, and blocked reason. This makes it the single endpoint agents call for ALL ticket state changes.

## Checklist

- [ ] Update the HTTP handler in `convex/http.ts` at `/update-ticket-status` — accept new optional fields in the request body: `commits` (array of strings), `checklistCompleted` (number), `checklistTotal` (number)
- [ ] Update `convex/tickets.ts` `updateStatusInternal` mutation — handle the new fields: merge commits (append, don't replace), update checklist counts, set timestamp fields (`startedAt` when moving to `in-progress`, `reviewAt` when moving to `review`, `completedAt` when moving to `completed`, `blockedAt` when moving to `blocked`)
- [ ] Clear `blockedAt` and `blockedReason` when status moves OUT of `blocked`
- [ ] Validate: `checklistCompleted` must be ≤ `checklistTotal`
- [ ] Return enriched response: include `epicStatus` (the auto-calculated epic status from ticket 01) so the agent knows if the epic also changed

## Files

- `convex/http.ts` — modify `/update-ticket-status` handler to accept new fields
- `convex/tickets.ts` — modify `updateStatusInternal` to handle commits, checklist, timestamps

## Patterns to follow

- Reference: `convex/http.ts` → existing `/update-ticket-status` handler — extend it, don't create a new endpoint
- Reference: `convex/schema/tickets.ts` → fields `commits`, `checklistTotal`, `checklistCompleted`, `startedAt`, `reviewAt`, `completedAt`, `blockedAt` — all already in schema, just need to be populated
