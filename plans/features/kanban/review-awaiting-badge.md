# Review Awaiting Badge

**Status:** in-progress
**Priority:** low
**Agent:** Charizard 🔥

## What it does

Add a visual indicator at the top of the kanban board showing how many features are waiting for review. Makes it easy for Juan to see at a glance if there's work to approve.

Example: a subtle badge or banner like "3 features awaiting review" near the top of the board, or a highlight/count on the Review column header.

## Checklist

- [ ] Count features with status `review`
- [ ] If count > 0, show a badge or banner (location TBD — could be in ProjectHeader or above the board)
- [ ] Use `text-status-review` color for visual consistency
- [ ] Hide when count is 0

## Files

- `src/app/[locale]/(app)/projects/[projectId]/page.tsx` or `_components/KanbanBoard.tsx`
