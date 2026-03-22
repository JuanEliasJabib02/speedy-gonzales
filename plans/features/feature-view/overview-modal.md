# Overview as Modal (not PlanViewer)

**Status:** completed
**Priority:** high

## Problem

Clicking "Overview" opens the `_context.md` in the main PlanViewer panel, replacing whatever ticket the user was reading. This is disorienting — you lose your place.

## Solution

Move the Overview content into a modal (like Roadmap). The Overview button stays in the sidebar but opens a `Dialog` instead of selecting a ticket in the PlanViewer.

## Checklist

- [x] Create `OverviewModal.tsx` component using shadcn/ui `Dialog`
- [x] Modal shows the feature title, status, priority, and renders the `_context.md` content with full markdown support (react-markdown)
- [x] Replace the `onClick={() => onSelect(contextTicket.id)}` in `TicketSidebar.tsx` with `open state` that triggers the modal
- [x] The PlanViewer is no longer responsible for rendering the overview — remove `contextTicket` selection logic from `FeatureLayout`
- [x] Modal has close button (X) and click-outside-to-close behavior
- [x] Style with design system tokens — consistent with `RoadmapModal`

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/OverviewModal.tsx` (new)
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/TicketSidebar.tsx`
