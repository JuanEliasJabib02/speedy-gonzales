# Blocked Status — UI & Workflow

**Status:** completed
**Priority:** critical

## What it does

Make the "blocked" status a first-class citizen in the UI. Currently blocked tickets exist in the data model but have no distinct visual treatment, no way to add a reason, and no way to unblock them easily.

## Features

### 1. Visual treatment
- Blocked tickets get a distinct red/orange badge + icon (🔴 or ⛔)
- In the sidebar: blocked tickets appear at the TOP of the list (before review) with a subtle warning background
- The blocked indicator is more prominent than other status badges

### 2. Block reason
- When moving a ticket to "blocked": show a small popover or second step asking for a reason (optional text)
- Store the reason in Convex (`blockedReason` field on tickets)
- Display the reason below the ticket title in the PlanViewer header

### 3. Quick unblock
- Blocked tickets show an "Unblock" button in the PlanViewer header
- Clicking it moves the ticket back to `in-progress` (or the previous status)

### 4. Blocked summary in Roadmap
- The Roadmap modal shows blocked tickets first, highlighted with their reason

## Checklist

- [x] Add `blockedReason: v.optional(v.string())` to tickets Convex schema
- [x] In `TicketItem.tsx` and `PlanViewer.tsx` status dropdown: when selecting "blocked", show an optional reason input
- [x] Update status sort order: blocked → review → in-progress → todo → completed
- [x] Style blocked badge: red with ⛔ icon
- [x] Add "Unblock →" quick action button on blocked tickets in PlanViewer
- [x] Update `RoadmapModal.tsx` to highlight blocked tickets with reason
- [x] Update `updateStatus` mutation to accept optional `blockedReason`

## Files

- `convex/schema.ts` — add `blockedReason` to tickets
- `convex/tickets.ts` — update `updateStatus` mutation
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/TicketItem.tsx`
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/PlanViewer.tsx`
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/RoadmapModal.tsx`
