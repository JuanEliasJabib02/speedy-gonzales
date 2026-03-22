# Rename mock-data.ts to kanban-config.ts

**Status:** review
**Priority:** low
**Agent:** Charizard 🔥

## What it does

The file `_constants/mock-data.ts` no longer contains mock data — it holds real types and config (STATUS_CONFIG, ACTIVE_COLUMNS, Feature type). Rename it to `kanban-config.ts` to match its actual purpose.

## Checklist

- [x] Rename `_constants/mock-data.ts` → `_constants/kanban-config.ts`
- [x] Update all imports referencing `mock-data` across KanbanBoard, KanbanColumn, FeatureCard, and page.tsx

## Files

- `src/app/[locale]/(app)/projects/[projectId]/_constants/mock-data.ts`
- `src/app/[locale]/(app)/projects/[projectId]/_components/KanbanBoard.tsx`
- `src/app/[locale]/(app)/projects/[projectId]/_components/KanbanColumn.tsx`
- `src/app/[locale]/(app)/projects/[projectId]/_components/FeatureCard.tsx`
- `src/app/[locale]/(app)/projects/[projectId]/page.tsx`
