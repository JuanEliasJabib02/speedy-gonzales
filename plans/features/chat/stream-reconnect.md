# Stream Reconnect on Page Reload

**Status:** in-progress
**Priority:** high

## Bug Description

When the user reloads the page while the agent is actively streaming a response, the SSE connection is lost and the agent appears to stop responding. The in-progress message gets stuck in a "streaming" state with no way to recover.

## Expected Behavior

- On reload: detect if there's an in-progress/incomplete message in Convex
- If so: show the partial response that was already saved, with a "Response was interrupted" indicator
- Or: automatically resume/retry the last user message

## Root Cause

The SSE stream is tied to the browser's fetch lifecycle. On reload:
1. The fetch is aborted (connection drops)
2. The streaming message in Convex stays in a "partial" state (no `isComplete` flag)
3. On remount, the UI has no way to know the stream was interrupted

## Approach

### Option A — Mark incomplete messages on unmount (recommended)
- Track `isStreaming` state in Convex chatMessages (add boolean field)
- When `useSendChat` unmounts mid-stream (page unload, navigation), mark the message as `isStreaming: false, isInterrupted: true`
- On mount: if last assistant message has `isInterrupted: true`, show a "Reconnect" button to re-send the last user message
- Use `useEffect` cleanup + `beforeunload` event to mark the message

### Option B — Idempotent streaming
- Store the full response in Convex as it streams (already done?)
- On reload: show whatever was saved, no interrupted state

## Checklist

- [ ] Add `isStreaming` and `isInterrupted` fields to `chatMessages` schema in `convex/schema.ts`
- [ ] Set `isStreaming: true` when starting a stream in `/api/chat/route.ts`
- [ ] Set `isStreaming: false` when stream completes normally
- [ ] In `useSendChat`: on unmount (useEffect cleanup), call mutation to mark last streaming message as `isInterrupted: true`
- [ ] In `ChatMessage.tsx`: if `isInterrupted`, show a subtle "Response interrupted — Retry?" indicator
- [ ] "Retry" re-sends the last user message and replaces the interrupted message

## Files

- `convex/schema.ts` — add `isStreaming`, `isInterrupted` fields
- `convex/chat.ts` — mutation to mark message as interrupted
- `src/app/api/chat/route.ts` — set isStreaming flags during stream lifecycle
- `src/hooks/useSendChat.ts` — cleanup handler on unmount
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/ChatMessage.tsx` — interrupted UI
