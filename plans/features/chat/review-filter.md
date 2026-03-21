# Add Review Filter Tab to Ticket Sidebar

**Status:** todo
**Priority:** medium
**Feature:** OpenClaw Chat

## What it does

Add a "Review" tab to the TicketSidebar so the user can filter tickets by `review` status. Also add inline status change UI on each ticket item (click status dot to change status via dropdown).

## Checklist

- [ ] Add "Review" to `STATUS_TABS` in `TicketSidebar.tsx`
- [ ] Create Convex mutation `updateTicketStatus` in `convex/tickets.ts`
- [ ] Add inline status dot on `TicketItem.tsx` — click opens a `DropdownMenu` with status options
- [ ] Wire dropdown to `updateTicketStatus` mutation
- [ ] Add shadcn `DropdownMenu` component if not already installed
- [ ] Status dot color matches status (muted=todo, yellow=in_progress, blue=review, green=completed, red=blocked)

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/TicketSidebar.tsx`
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/TicketItem.tsx`
- `convex/tickets.ts`
