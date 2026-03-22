# Roadmap Modal

**Status:** todo
**Priority:** high
**Feature:** OpenClaw Chat

## Overview

A "Roadmap" button in the feature view that opens an elegant modal showing all tickets for the current feature, organized by priority (high → medium → low) with visual status indicators.

## Goal

Give the user a quick visual overview of what the agent is working on per feature — without leaving the current view.

## UX

- Button: `Roadmap` (with a map/list icon) in the feature header or chat header
- Click opens a modal overlay
- Modal shows all tickets for the current feature grouped/sorted by priority:
  - 🔴 High
  - 🟡 Medium  
  - 🟢 Low
- Each ticket shows: title, status badge (todo / in_progress / review / completed / blocked), and short description
- Modal has an X button to close (or click outside)
- Responsive: looks great on desktop and mobile

## Implementation

### Components
- `RoadmapButton` — triggers the modal (placed in feature header)
- `RoadmapModal` — shadcn/ui Dialog component
- `TicketRow` — individual ticket display with priority color and status badge

### Data
- Tickets come from Convex `tickets` table via `useQuery(api.tickets.listByEpic, { epicId })`
- Sort order: blocked → in_progress → todo → review → completed
- Priority groups: high first, then medium, then low

### Styling
- Use shadcn/ui `Dialog` for the modal
- Priority badges with color coding
- Status badges: todo (muted), in_progress (yellow), review (blue), completed (green), blocked (red)
- Clean list layout, max-height with scroll if many tickets
- Subtle entrance animation

## Files to create/modify
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/RoadmapModal.tsx` (new)
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/page.tsx` (add button)

## Acceptance Criteria
- [ ] Roadmap button visible in feature view
- [ ] Modal opens on click with all tickets for the feature
- [ ] Tickets sorted by priority (high → low) and grouped
- [ ] Each ticket shows name, status, and priority badge
- [ ] Modal closes on X or outside click
- [ ] Works on mobile

