# Review Awaiting Badge

**Status:** review
**Priority:** low
**Agent:** Charizard 🔥

## What it does

Add a visual indicator at the top of the kanban board showing how many features are waiting for review. Makes it easy for Juan to see at a glance if there's work to approve.

Example: a subtle badge or banner like "3 features awaiting review" near the top of the board, or a highlight/count on the Review column header.

## Checklist

- [x] Count features with status `review`
- [x] If count > 0, show a highlighted badge on the Review column header
- [x] Use `text-status-review` color for visual consistency
- [x] Hide highlight when count is 0 (falls back to default muted badge)

## Files

- `src/app/[locale]/(app)/projects/[projectId]/page.tsx` or `_components/KanbanBoard.tsx`
