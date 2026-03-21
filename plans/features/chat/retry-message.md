# Retry Last Message

**Status:** in-progress
**Priority:** high

## What it does

Add a retry button on assistant messages so the user can re-send the last user message without copying and pasting. Useful when the agent gives a bad or incomplete response.

## Checklist

- [ ] Show a 🔄 retry icon on hover over assistant messages
- [ ] On click: re-send the user message that triggered this response
- [ ] Delete the old assistant message from Convex before re-sending (or mark as retried)
- [ ] Trigger a new streaming response

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/ChatMessage.tsx`
- `src/hooks/useSendChat.ts`

