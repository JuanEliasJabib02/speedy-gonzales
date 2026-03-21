# Feature 5: Kanban

**Status:** todo
**Phase:** 3

## What it does

When you click a project from the dashboard, you see a **kanban board of features (epics)** — not individual tickets. Each card is a feature, organized by status columns. Click a feature card to enter the Feature View.

This is the **project-level overview**. You see the big picture: which features are planned, which are in progress, which are done.

## UI

```
┌──────────────────────────────────────────────────────────────┐
│  ← My SaaS                                                  │
├──────────┬────────────┬──────────┬──────────┬───────────────┤
│   Todo   │In Progress │  Review  │ Blocked  │  Completed    │
├──────────┼────────────┼──────────┼──────────┼───────────────┤
│ ┌──────┐ │ ┌────────┐ │          │          │ ┌───────────┐ │
│ │Paymts│ │ │ Auth   │ │          │          │ │   Setup   │ │
│ │  0%  │ │ │  75%   │ │          │          │ │   100%    │ │
│ │ 3 tix│ │ │ 4 tix  │ │          │          │ │   2 tix   │ │
│ └──────┘ │ └────────┘ │          │          │ └───────────┘ │
│          │            │          │          │               │
└──────────┴────────────┴──────────┴──────────┴───────────────┘
```

## Feature card contents

- Feature title (from epic's frontmatter)
- Progress bar + percentage
- Ticket count
- Priority indicator (color or badge)
- **Click → navigates to `/projects/[projectId]/features/[epicId]`**

## Columns

5 columns matching the status values:
1. **Todo** — not started
2. **In Progress** — agent is working
3. **Review** — agent finished, needs human review
4. **Blocked** — agent got stuck
5. **Completed** — user approved

## Drag & drop (optional for MVP)

If implemented: dragging a feature card to a different column:
1. Optimistically updates UI
2. Updates epic status in Convex
3. Schedules action to update the PLAN.md frontmatter in the repo
4. Commits the change

For MVP, this could be skipped — the agent moves features by editing the `.md` files directly. The user can focus on reading and chatting.

## Empty state

When a project has no synced features:
- "No features found. Link a repo with a plans/ folder, or create features from the chat."
- "Sync now" button

## Frontend components

```
src/app/[locale]/(app)/projects/[projectId]/
├── _components/
│   ├── KanbanBoard.tsx       # Grid of columns
│   ├── KanbanColumn.tsx      # Single column with status header
│   └── FeatureCard.tsx       # Card for one epic
├── _hooks/
│   └── useProjectKanban.ts   # Queries epics for project, groups by status
└── page.tsx
```

## Depends on

- Feature 4 (GitHub Sync) — needs epics data in DB

## Blocks

- Feature 6 (Feature View) — kanban cards link to feature detail
