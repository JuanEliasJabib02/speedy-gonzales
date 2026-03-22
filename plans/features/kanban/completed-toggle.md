# Completed Toggle

**Status:** todo
**Priority:** medium

## What it does

A toggle button in the project header that shows/hides the Completed column. By default, completed features are hidden to keep the board focused on active work.

## Checklist

- [x] Add "Completed (N)" button in ProjectHeader
- [x] Toggle state managed in page.tsx
- [x] When active: append Completed column to board
- [x] When inactive: hide Completed column
- [x] Button styling: ghost when off, secondary + green text when on
- [x] Show count of completed features in button label

## Files

- `src/app/[locale]/(app)/projects/[projectId]/_components/ProjectHeader.tsx`
- `src/app/[locale]/(app)/projects/[projectId]/_components/KanbanBoard.tsx`
