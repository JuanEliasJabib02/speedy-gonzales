# Add Analytics Timestamps to Ticket Schema

**Status:** review
**Priority:** high
**Agent:** Perro salchicha 🌭

## What it does

Add timestamp fields to the tickets schema so we can measure resolution time, review time, and block time. These are set automatically when ticket status changes.

## Checklist

- [x] Add to `convex/schema/tickets.ts`: `startedAt` (optional number), `reviewAt` (optional number), `completedAt` (optional number), `blockedAt` (optional number), `completionType` (optional: `"clean"` | `"with-fixes"`)
- [x] In `convex/tickets.ts` `updateStatus` mutation: set `startedAt = Date.now()` when status changes to `in-progress`
- [x] In `convex/tickets.ts` `updateStatus`: set `reviewAt = Date.now()` when status changes to `review`
- [x] In `convex/tickets.ts` `updateStatus`: set `completedAt = Date.now()` when status changes to `completed`
- [x] In `convex/tickets.ts` `updateStatus`: set `blockedAt = Date.now()` when status changes to `blocked`
- [x] In `convex/tickets.ts` `updateStatusInternal`: same timestamp logic
- [x] In `convex/http.ts` update-ticket-status endpoint: same timestamp logic

## Files

- `convex/schema/tickets.ts`
- `convex/tickets.ts`
- `convex/http.ts`

## Commits

- `c4630b50c84412714fcf12d40574b11a7d0c15bd`
