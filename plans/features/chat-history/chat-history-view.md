# Chat History View

**Status:** todo
**Priority:** medium

## What it does

A dedicated view (sidebar or page) that lists all feature conversations sorted by last activity. Unread conversations float to the top with a blue dot.

## Checklist

- [ ] Route: `/projects/[projectId]/chats` or sidebar panel
- [ ] Each row: feature name, project, last message snippet, relative time, unread dot
- [ ] Sort: unread first, then by lastMessageAt desc
- [ ] Click row → navigate to feature view with chat open
- [ ] Empty state: "No chats yet — start a conversation in any feature"
- [ ] Search/filter by feature name

## Files

- `src/app/[locale]/(app)/projects/[projectId]/chats/page.tsx` (new)
- `src/lib/components/common/ChatHistoryItem.tsx` (new)
