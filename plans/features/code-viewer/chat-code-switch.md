# Chat ↔ Code Switch

**Status:** todo
**Priority:** medium

## What it does

Add a toggle in the right panel header to switch between Chat view and Code view. Like a tab switcher — clean, instant, no page navigation.

## Checklist

- [ ] Add toggle buttons "Chat" | "Code" in the ChatPanel/right-panel header
- [ ] Switch state lives in the FeatureView parent (or URL param for shareability)
- [ ] When "Code" → show FileTree (left) + FileViewer (right)
- [ ] When "Chat" → show TicketSidebar (left) + ChatPanel (right) as normal
- [ ] Animate the transition (fade or slide)
- [ ] Remember last mode in localStorage

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/page.tsx`
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/ChatPanel.tsx`
