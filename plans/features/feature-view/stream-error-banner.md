# Stream Error Banner

**Status:** completed
**Priority:** medium

## What it does

When a stream fails mid-response (network drop, timeout, agent error), show a clear visual indicator on the incomplete message so the user knows what happened and can retry.

## Current behavior

If streaming fails mid-way, the partial message just stops. No indication it's incomplete.

## Desired behavior

- Detect when stream ends abruptly (no `[DONE]`, or error caught in useSendChat)
- Mark the message as `isInterrupted: true` in Convex metadata
- Render a yellow/orange banner below the partial message: "Message may be incomplete — Retry"
- Retry button re-sends the last user message

## Checklist

- [x] Add `isInterrupted` field to chatMessages schema in Convex
- [x] Set `isInterrupted: true` in saveAssistantMessage when stream errors
- [x] Add `InterruptedBanner` component in ChatMessage.tsx
- [x] Show banner only when `message.isInterrupted === true`
- [x] Wire retry button to `onRetry` prop (already exists in ChatMessage)

## Files

- `convex/schema.ts` (add isInterrupted field)
- `convex/chat.ts` (set isInterrupted on error)
- `src/app/api/chat/route.ts` (pass isInterrupted flag)
- `src/app/.../ChatMessage.tsx` (render banner)
