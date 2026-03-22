# Thinking Indicator with Elapsed Timer

**Status:** todo
**Priority:** high

## What it does

Show a "Thinking..." indicator with an elapsed time counter the instant the user sends a message. Replace with streaming content once the first token arrives. Like Claude.ai's thinking animation.

## Checklist

- [ ] Add a `ChatThinkingBubble` component with pulsing dots + elapsed timer
- [ ] Show it immediately when user submits a message (before API call returns)
- [ ] Start a timer (0s, 1s, 2s...) so the user knows the system is working
- [ ] Transition smoothly to streaming content when first token arrives
- [ ] Remove thinking bubble when streaming starts
