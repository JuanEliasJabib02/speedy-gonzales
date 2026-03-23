# Wire NewTicketModal onSubmit

**Status:** in-progress
**Priority:** medium
**Agent:** Perro salchicha 🌭

## What it does

NewTicketModal builds a prompt string and calls `onSubmit?.(prompt)`, but TicketSidebar never passes `onSubmit`. The "Create" button appears functional but does nothing. Wire it to actually create a ticket.

## Checklist

- [ ] Decide on creation path: Convex mutation that creates a ticket `.md` in the repo via GitHub API, OR a simpler approach that creates it locally
- [ ] Pass `onSubmit` callback from TicketSidebar to NewTicketModal
- [ ] The callback should call a Convex mutation (e.g. `tickets.createFromPrompt`) that creates the ticket
- [ ] Show loading state while creating
- [ ] Close modal and refresh ticket list on success
- [ ] Show error toast on failure

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/NewTicketModal.tsx`
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/TicketSidebar.tsx`
