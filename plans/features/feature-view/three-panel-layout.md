# Three-Panel Layout

**Status:** todo

## What it does

The main layout for the feature view. Three panels side-by-side filling the full viewport height. The app sidebar is hidden in this view to maximize space.

## Checklist

- [x] Create `FeatureLayout` component with flex layout
- [x] Left panel: TicketSidebar (280px, fixed width)
- [x] Center panel: PlanViewer (flex-1, scrollable)
- [x] Right panel: ChatPanel (resizable width)
- [x] Hide app sidebar when pathname includes `/features/` (checked in `(app)/layout.tsx`)
- [x] Full height layout (h-screen via parent)

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/FeatureLayout.tsx`
- `src/app/[locale]/(app)/layout.tsx` — conditionally hides sidebar
