# Feature View

**Status:** review
**Priority:** high

## Overview

The core screen of Speedy Gonzales — a three-panel workspace where you manage a feature end-to-end. You enter here by clicking a feature card from the kanban.

## Layout (three panels, resizable)

- **Left — Ticket Sidebar** (`TicketSidebar.tsx`): lists all tickets in the feature with status badges, search filter, and a "New ticket" button (`NewTicketModal.tsx`). Shows epic title, branch name, sync status, and last sync time. The "Overview" / `_context` ticket is excluded from the list.
- **Center — Plan Viewer** (`PlanViewer.tsx`): renders the selected ticket's markdown as formatted HTML. Shows title, status dropdown (with transitions), priority, blocked reason banner, checklist progress, and commit pills linking to GitHub. Status changes update Convex directly. Blocked tickets show an "Unblock" button.
- **Right — Commit Timeline** (`CommitTimeline.tsx`): fetches commits from GitHub via API proxy, shows them as timeline cards with author, date, file changes, and diff viewer. Supports branch detection with fallback, load-more pagination, refresh, and per-ticket filtering. Commit cards show linked ticket pills when the commit message matches a ticket slug.

Panels are separated by a draggable `ResizeHandle.tsx` for the timeline width.

## Key components

| Component | Lines | What it does |
|-----------|-------|-------------|
| `PlanViewer` | 413 | Markdown viewer + status controls + blocked banner + commit pills |
| `CommitDiffPanel` | 290 | Modal that shows file diffs for a specific commit (fetched from GitHub) |
| `CommitTimeline` | 271 | Scrollable timeline of commits with ticket linking + filtering |
| `TicketItem` | 159 | Individual ticket row with status badge, checklist progress, agent name |
| `TicketSidebar` | 144 | Left panel with ticket list, search, sync info |
| `FeatureLayout` | 126 | Three-panel composer — wires hooks + components |
| `NewTicketModal` | 121 | Dialog to create a new ticket from the UI |
| `ChecklistProgress` | 22 | Progress bar for checklist items |
| `ResizeHandle` | 14 | Draggable divider between panels |

## Hooks

- `useLivePlan.ts` — fetches epic + tickets from Convex, provides `getTicketContent()` helper
- `useCommitTimeline.ts` — fetches commits from GitHub API proxy with pagination and branch fallback

## Helpers

- `matchCommitToTickets.ts` — matches commit messages to ticket slugs for linking pills on timeline cards

## Data flow

1. `page.tsx` renders `FeatureLayout` with `projectId` and `epicId`
2. `useLivePlan` queries Convex for epic data + tickets (reactive, real-time)
3. `useCommitTimeline` fetches from `/api/github/commits` proxy → GitHub API
4. Status changes go through `tickets.updateStatus` mutation → Convex → pushes to GitHub via `githubSync.pushTicketStatusToGitHub`
5. Blocked tickets store `blockedReason` in Convex, parsed from `## Blocked` section in the `.md` file
