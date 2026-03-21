# Export Conversation

**Status:** todo
**Priority:** low

## What it does

Download the current chat conversation as a `.md` file. Useful for documenting decisions, sharing context, or archiving a feature discussion.

## Checklist

- [ ] Add "Export" button in the chat header
- [ ] Format: markdown with timestamps, user/agent labels, and message content
- [ ] Include feature name and date in the filename (e.g. `chat-feature-view-2026-03-21.md`)
- [ ] Trigger browser download (no server needed — pure client-side)

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/ChatPanel.tsx`

