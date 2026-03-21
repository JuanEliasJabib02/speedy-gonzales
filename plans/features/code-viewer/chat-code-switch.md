# Chat ↔ Code Switch

**Status:** review
**Priority:** medium

## What it does

Add a toggle in the right panel header to switch between Chat view and Code view. Like a tab switcher — clean, instant, no page navigation.

## Checklist

- [x] Add toggle buttons "Chat" | "Code" in the ChatPanel/right-panel header
- [x] Switch state lives in the FeatureView parent (or URL param for shareability)
- [x] When "Code" → show CodeView placeholder (coming soon)
- [x] When "Chat" → show TicketSidebar (left) + ChatPanel (right) as normal
- [x] Animate the transition (fade or slide)
- [x] Remember last mode in localStorage

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/page.tsx`
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/ChatPanel.tsx`
