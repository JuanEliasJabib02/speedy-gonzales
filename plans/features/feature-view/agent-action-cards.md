# Agent Action Cards

**Status:** completed
**Priority:** medium

## What it does

When the agent performs an action (creates a ticket, moves a status, triggers a sync), instead of only showing text, render a visual card that confirms what happened. Like GitHub's commit cards in Slack.

## Examples

- ✅ Ticket created: `feat/syntax-highlighting` → `todo`
- 🔄 Status updated: `wire-convex` → `in-progress`
- 📦 Sync triggered for `speedy-gonzales`

## Checklist

- [x] Define action patterns detected from agent text responses
- [x] Parse action metadata from agent responses via regex patterns
- [x] Render `ActionCard` component below the text response
- [x] Card variants: `ticket-created`, `status-updated`, `sync-triggered`
- [x] Cards show type label, title, and detail with appropriate styling

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/ChatMessage.tsx`
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/ActionCard.tsx` (new)

