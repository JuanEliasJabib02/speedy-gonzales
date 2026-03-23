# Fix Rate Limit Crash — Agent Dies Instead of Falling Back

**Status:** backlog
**Priority:** high

## Overview

When the primary model (Opus) hits rate limits, OpenClaw should fall back to Sonnet → Haiku. On 2026-03-22 ~23:49, all three models hit rate limits simultaneously and the agent crashed with:

```
All models failed (3): anthropic/claude-opus-4-6: rate_limit | anthropic/claude-sonnet-4-6: rate_limit | anthropic/claude-haiku-4-5: rate_limit
```

The fallback chain IS configured but all models exhausted at the same time due to heavy usage (22 tickets dispatched in one session). Need to investigate:

1. Is the fallback actually working? (does it try Sonnet before dying?)
2. Should there be a retry-with-backoff before declaring failure?
3. Should the agent queue the response and retry in 60s instead of crashing?

## Error log

```
⚠️ Agent failed before reply: All models failed (3)
```

Captured 2026-03-23 00:01 GMT-5.

## Still needs

- [ ] Investigate OpenClaw fallback behavior on rate limits
- [ ] Add retry-with-backoff before giving up
