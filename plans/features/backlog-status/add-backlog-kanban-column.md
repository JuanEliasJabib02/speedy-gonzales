# Add Backlog Column to Kanban Board

**Status:** review
**Priority:** high
**Agent:** Perro salchicha 🌭

## What it does

Add a "Backlog" column to the kanban board, positioned before "Todo". This gives Juan a place to park planned features that aren't ready for the autonomous loop yet.

## Checklist

- [x] Add `"backlog"` to `ACTIVE_COLUMNS` in `kanban-config.ts` — insert before `"todo"`
- [x] Add `backlog` config to `STATUS_CONFIG` with label "Backlog" and a neutral color class
- [x] The backlog column should be visually distinct (slightly dimmer/grayed out) to signal "not active"
- [x] Add a toggle or option to hide/show the backlog column (similar to the existing `showCompleted` toggle) — default to shown
- [x] Ensure drag-and-drop works to move features from backlog → todo and vice versa

## Files

- `src/app/[locale]/(app)/projects/[projectId]/_constants/kanban-config.ts`
- `src/app/[locale]/(app)/projects/[projectId]/_components/KanbanBoard.tsx`
- `src/app/[locale]/(app)/projects/[projectId]/_components/KanbanColumn.tsx`
- `src/app/[locale]/(app)/projects/[projectId]/_components/ProjectHeader.tsx`
- `src/app/[locale]/(app)/projects/[projectId]/page.tsx`
- `src/styles/globals.css`

## Commits
- `753337589260c1ebbe6b6eeee90a6cee4c44eab9`
