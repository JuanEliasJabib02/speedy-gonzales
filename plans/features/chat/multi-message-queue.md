# Multi-Message Queue (Slack-style Input)

**Status:** review
**Priority:** medium

## What it does

Currently the chat is strict request-response — the user sends one message, waits for reply, then sends another. This ticket adds a debounce/queue so the user can send multiple messages in a row and the agent processes them together, like Slack.

## Approach

Debounce on the frontend: wait 2s after the last keypress/send before firing the request. If multiple messages arrive in that window, concatenate them into a single request.

## Checklist

- [ ] Add debounce (2s) to `useSendChat` before firing the API call
- [ ] If user sends while agent is responding, queue the message and send after response completes
- [ ] Show a "queued" indicator in the input when a message is waiting
- [ ] Test: send 3 messages rapidly → agent receives them as one grouped prompt

## Files

- `src/hooks/useSendChat.ts`
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/ChatInput.tsx`

