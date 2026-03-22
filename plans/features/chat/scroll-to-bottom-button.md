# Scroll to Bottom Button

**Status:** todo
**Priority:** medium

## Overview

When the chat has many messages and the user scrolls up to read history, a floating "scroll to bottom" button appears. Clicking it smoothly scrolls back to the latest message.

## Acceptance criteria

- [ ] Button is hidden when the user is already at (or near) the bottom
- [ ] Button appears when the user scrolls up past a threshold (~200px from bottom)
- [ ] Button is a floating pill/icon anchored to the bottom-right of the chat message list
- [ ] Clicking it smooth-scrolls to the latest message
- [ ] Button disappears again once the user is back at the bottom
- [ ] Works with streaming responses (new tokens arriving while scrolled up)

## Implementation notes

- Use a scroll event listener on the messages container to track scroll position
- Compare `scrollTop + clientHeight` vs `scrollHeight` to detect if near bottom
- Button: fixed/absolute positioned, z-index above messages, bottom-right corner
- Use `scrollIntoView` or `scrollTo({ behavior: 'smooth' })` on the bottom anchor ref
- Existing `messagesEndRef` in `ChatPanel.tsx` can be reused for the scroll target
