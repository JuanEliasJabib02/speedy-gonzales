# Ticket Sidebar

**Status:** completed
**Priority:** medium

## What it does

Left panel showing all tickets for the current feature. Each ticket has a status dot and title. Clicking a ticket shows its plan in the center viewer. Includes a git branch indicator, a search bar, and status filter tabs to filter tickets.

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
- [x] Status filter tabs (All, Todo, In Progress, Done) with pill styling
- [x] Count badges on each tab showing number of tickets per status
- [x] Active tab styled with status-matching color (muted, blue, green)
- [x] Filters compose with search (search within selected tab)

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/TicketSidebar.tsx`
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/TicketItem.tsx`
