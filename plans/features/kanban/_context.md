# Kanban

**Status:** completed
**Priority:** high

## Overview

When you click a project from the dashboard, you see a kanban board of features (epics). Each card is a feature, organized by status columns. Click a feature card to enter the Feature View.

## Columns

1. **Todo** — not started
2. **In Progress** — agent is working
3. **Review** — agent finished, needs human review
4. **Blocked** — agent got stuck
5. **Completed** — hidden by default, toggle to show

## UI built (mock)

- [x] ProjectHeader with back arrow to dashboard, project name, completed toggle, "Sync now" button (placeholder)
- [x] KanbanBoard with 4 active columns (Todo, In Progress, Review, Blocked)
- [x] Completed column hidden by default, toggled via "Completed (N)" button in header
- [x] KanbanColumn with colored status dot, label, count badge, empty state
- [x] FeatureCard with title, progress bar, priority pill, ticket count
- [x] Click feature card navigates to feature view

## Components

- `ProjectHeader` — back arrow, project name, completed toggle button, sync now button
- `KanbanBoard` — horizontal flex layout with overflow-x-auto
- `KanbanColumn` — individual column with header dot + label + count + cards
- `FeatureCard` — card with progress bar, priority pill, ticket count

## Still needs

- [ ] Wire to Convex queries (useQuery for epics grouped by status)
- [ ] Remove mock data

## Depends on

- Feature 4 (GitHub Sync) — needs epics data in DB

## Blocks

- Feature 6 (Feature View) — kanban cards link to feature detail
