# Optimistic User Message Rendering

**Status:** todo
**Priority:** medium

## What it does

Show the user's message in the chat immediately after they press send, without waiting for the Convex mutation to confirm. The message appears instantly in the UI while being saved to Convex in the background.

## Checklist

- [ ] Add the user message to local state immediately on submit
- [ ] Show it in the chat with a subtle "sending" indicator (optional)
- [ ] Save to Convex in the background
- [ ] If save fails, show an error state on the message (retry option)
- [ ] Ensure message order stays correct when Convex confirms
