# Kanban Board Layout

**Status:** todo
**Priority:** medium

## What it does

Horizontal scrollable board with status columns. Each column shows features filtered by status with a colored header dot and count badge.

## Checklist

- [x] Create `KanbanBoard` component with horizontal flex + overflow-x-auto
- [x] 4 active columns by default (Todo, In Progress, Review, Blocked)
- [x] Column header: status dot (colored) + label + count badge
- [x] Column background: bg-card/50, min-w-[260px], rounded-lg
- [x] Empty column state: dashed border + "No features" text

## Files

- `src/app/[locale]/(app)/projects/[projectId]/_components/KanbanBoard.tsx`
- `src/app/[locale]/(app)/projects/[projectId]/_components/KanbanColumn.tsx`
