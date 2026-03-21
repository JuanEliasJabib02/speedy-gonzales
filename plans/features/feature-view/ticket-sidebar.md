# Ticket Sidebar

**Status:** todo

## What it does

Left panel showing all tickets for the current feature. Each ticket has a status dot and title. Clicking a ticket shows its plan in the center viewer. Includes a git branch indicator and a search bar to filter tickets.

## Checklist

- [x] Create `TicketSidebar` component (280px, bg-card, border-r)
- [x] Show epic title at top with FileText icon
- [x] Back arrow button to navigate to kanban
- [x] Git branch indicator (GitBranch icon + monospace branch name, e.g. `feat/xxx`)
- [x] Search bar to filter tickets by title (Search icon + Input, text-xs)
- [x] "No tickets found" empty state when search has no results
- [x] List tickets with `TicketItem` components
- [x] Status dots colored by ticket status
- [x] Active ticket highlighted with bg-accent
- [x] Scrollable with scrollbar-thin

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/TicketSidebar.tsx`
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/TicketItem.tsx`
