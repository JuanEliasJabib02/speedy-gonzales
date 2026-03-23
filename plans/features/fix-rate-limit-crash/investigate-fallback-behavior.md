# Investigate and Fix Model Fallback on Rate Limits

**Status:** backlog
**Priority:** high
**Agent:** Charizard 🔥

## What it does

Debug why the agent crashes instead of gracefully handling rate limits. The fallback chain (Opus → Sonnet → Haiku) should work, but when all three exhaust at once the agent dies completely. Investigate OpenClaw's retry/fallback config and add resilience.

## Checklist

- [ ] Check OpenClaw config: is `models.fallback` configured correctly?
- [ ] Check openclaw logs from 2026-03-23 00:01 — did it actually TRY Sonnet/Haiku or did they all fail instantly?
- [ ] Check if there's a `retryAfter` or `backoff` config in OpenClaw
- [ ] If not: open an issue or feature request on OpenClaw for retry-with-backoff
- [ ] Document the findings and recommended config changes
