# Chat Context Summary Card on Entry

**Status:** todo
**Priority:** medium

## What it does

When the user opens a feature chat that has previous messages, show a summary card at the top with what the agent knows and what was happening. Eliminates the "where were we?" problem.

## Checklist

- [ ] Create `ContextSummaryCard` component in `_components/`
- [ ] Assemble summary from existing data in `useSendChat` (epic, tickets, last messages)
- [ ] Show: feature name + status, last conversation topic, pending ticket count
- [ ] Only show when there are previous messages (skip for fresh chats)
- [ ] Make it collapsible/dismissable
- [ ] Style with design system tokens (bg-muted, border-border, etc.)

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/ContextSummaryCard.tsx`
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/ChatPanel.tsx`
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_hooks/useSendChat.ts`

