# Chat Performance & UX

**Status:** todo
**Priority:** high

## Overview

Optimize the chat experience so it feels fast and responsive despite Opus model latency. Focus on UX improvements that make the wait feel shorter — better feedback, parallel operations, and smoother streaming.

## Still needs

- [ ] Typing indicator with elapsed timer while waiting for first token
- [ ] Parallel Convex mutation (don't block streaming on createStreamingMessage)
- [ ] Optimistic user message rendering
- [ ] Progressive markdown rendering during streaming
- [ ] Connection warmup / keep-alive for OpenClaw endpoint

## Depends on

- feature-view (chat infrastructure)
