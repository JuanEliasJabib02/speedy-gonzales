# Rate Limit Fallback

**Status:** todo
**Priority:** high

## Overview

When Perro hits Claude Max's rate limit mid-loop, the entire autonomous cycle stops until the limit resets. This wastes hours of potential work time — especially overnight runs.

Fix: detect the rate limit, fall back to Sonnet (still on Max subscription, no API key needed), and continue working. Next cron cycle tries Opus again.

## Architecture decisions

- Detection: check Perro's exit code + output for "You've hit your limit" or similar rate limit messages
- Fallback: retry the SAME ticket with `claude --print --model claude-sonnet-4-20250514` — same Max auth, no extra cost
- Recovery: next cron cycle (30 min later) tries Opus first again. If Opus is back, great. If not, falls back to Sonnet again.
- No API key required — both Opus and Sonnet run on Max subscription
- This is a skill-level change only (autonomous-loop SKILL.md) — no Speedy code changes

## Still needs

- [ ] Detect rate limit in Perro's output and retry with Sonnet fallback
