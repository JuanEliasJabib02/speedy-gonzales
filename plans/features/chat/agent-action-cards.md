# Agent Action Cards

**Status:** todo
**Priority:** medium

## What it does

When the agent performs an action (creates a ticket, moves a status, triggers a sync), instead of only showing text, render a visual card that confirms what happened. Like GitHub's commit cards in Slack.

## Examples

- ✅ Ticket created: `feat/syntax-highlighting` → `todo`
- 🔄 Status updated: `wire-convex` → `in-progress`
- 📦 Sync triggered for `speedy-gonzales`

## Checklist

- [ ] Define a structured action response format (JSON in assistant message metadata)
- [ ] Parse action metadata from agent responses
- [ ] Render `ActionCard` component below the text response
- [ ] Card variants: `ticket-created`, `status-updated`, `sync-triggered`
- [ ] Link cards to the relevant ticket/feature when applicable

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/ChatMessage.tsx`
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/ActionCard.tsx` (new)
