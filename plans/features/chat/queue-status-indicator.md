# Queue Status Indicator

**Status:** review
**Priority:** low

## What it does

When the user sends multiple messages rapidly (multi-message queue), show a small indicator of how many messages are queued so they know the agent is processing them in order.

## Current behavior

`hasQueued` boolean exists in useSendChat but there's no visual feedback beyond the send button being disabled.

## Desired behavior

- Show a subtle badge or text in the chat input area: "2 messages queued..."
- Animate/fade out when the queue clears
- Only show when queue length > 0

## Checklist

- [x] Expose `queueLength` (number) from useSendChat instead of just `hasQueued`
- [x] Add queue indicator UI in ChatInput or ChatPanel (below the input)
- [x] Style: small muted text "X messages queued" with a spinner icon
- [x] Animate out smoothly when queue empties

## Files

- `src/app/.../ChatInput.tsx`
- `src/app/.../ChatPanel.tsx`
- `src/app/.../_hooks/useSendChat.ts`
