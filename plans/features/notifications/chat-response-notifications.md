# Chat Response Notifications

**Status:** todo
**Priority:** medium

## What it does

When the user sends a message and navigates away (or is on a different feature), notify them when the agent finishes responding.

## Checklist

- [ ] Detect when a streaming response completes for a chat session
- [ ] Create a notification: "Charizard replied in [feature name]"
- [ ] Include a snippet of the first line of the response
- [ ] Link to the feature chat
- [ ] Only notify if user is not actively watching the chat (check focus/visibility)
- [ ] Browser notification (optional, requires permission) as fallback

## Files

- `convex/chatMessages.ts` (trigger notification on message insert with role=assistant)
- `convex/notifications.ts`
