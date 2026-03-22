# Stop Button (Cancel Streaming Response)

**Status:** completed
**Priority:** high

## What it does

When the agent is responding, there's no way to stop it mid-stream. Add a "Stop" button that cancels the current SSE stream and saves the partial response as-is.

## Checklist

- [ ] Show a "Stop" button while agent is streaming (replaces Send button)
- [ ] On click: abort the fetch/SSE stream (`AbortController`)
- [ ] Save the partial response to Convex as the final message (don't discard it)
- [ ] Return input to normal state after stop
- [ ] Hide Stop button and restore Send button after response completes or is stopped

## Files

- `src/hooks/useSendChat.ts`
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/ChatInput.tsx`
- `src/app/api/chat/route.ts`

