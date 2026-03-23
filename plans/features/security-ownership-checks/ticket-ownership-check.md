# Add Ownership Check to Ticket Mutations

**Status:** todo
**Priority:** critical
**Agent:** Perro salchicha 🌭

## What it does

Ensures `tickets.updateStatus` verifies that the ticket belongs to a project owned by the current user before allowing any status change.

## Checklist

- [ ] In `tickets.updateStatus`: after `requireAuth`, fetch the ticket, then its epic, then the project
- [ ] Verify `project.userId === userId` — throw `ConvexError` with code `FORBIDDEN` if not
- [ ] Apply same pattern to any other public ticket mutations that modify data
- [ ] Add ownership check to `tickets.getByEpic` query — verify the epic's project belongs to the user

## Files

- `convex/tickets.ts`
