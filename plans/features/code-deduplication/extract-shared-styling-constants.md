# Extract Shared Status/Priority Styling Constants

**Status:** review
**Priority:** low
**Agent:** Perro salchicha 🌭

## What it does

Status pill colors, status dot colors, and priority styling maps are defined independently in PlanViewer, FeatureCard, TicketItem, and KanbanColumn. Also `timeAgo` helper is implemented in both CommitTimeline and TicketSidebar. Extract all to shared modules.

## Checklist

- [x] Create `src/lib/constants/status-styles.ts` with `STATUS_PILL`, `STATUS_DOT`, `PRIORITY_STYLES` maps
- [x] Import from the shared file in all 4 components, remove local definitions
- [x] Create `src/lib/helpers/timeAgo.ts` with the shared relative time logic
- [x] Import from the shared file in CommitTimeline and TicketSidebar, remove local implementations

## Files

- `src/lib/constants/status-styles.ts` (NEW)
- `src/lib/helpers/timeAgo.ts` (NEW)
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/PlanViewer.tsx`
- `src/app/[locale]/(app)/projects/[projectId]/_components/FeatureCard.tsx`
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/TicketItem.tsx`
- `src/app/[locale]/(app)/projects/[projectId]/_components/KanbanColumn.tsx`
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/CommitTimeline.tsx`
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/TicketSidebar.tsx`

## Commits
- `b0621feb977a785131eeb07c3d28a646b596718a`
