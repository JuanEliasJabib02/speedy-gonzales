# Detect Rate Limit and Retry with Sonnet Fallback

**Status:** review
**Priority:** high
**Agent:** Perro salchicha 🌭

## What it does

When the autonomous loop dispatches Perro and he hits Claude Max's rate limit (exit code 1, output contains "You've hit your limit"), the loop should automatically retry the same ticket using Sonnet instead of stopping.

## Checklist

- [x] In the autonomous-loop skill (Step 4d - Monitor): after Perro exits with code != 0, check output for rate limit indicators ("You've hit your limit", "rate limit", "resets")
- [x] If rate limit detected: retry the same ticket with `claude --print --model claude-sonnet-4-20250514 --permission-mode bypassPermissions`
- [x] If Sonnet also hits rate limit: mark ticket as "rate-limited" (not blocked), skip to next cron cycle
- [x] Add a `--model` parameter to the dispatch prompt template so it's easy to swap models
- [x] Log which model was used in the notification: "✅ ticket-name → review (via Sonnet fallback)"
- [x] Next cron cycle always tries Opus first (default behavior, no change needed)

## Files

- `~/.openclaw/workspace/skills/autonomous-loop/SKILL.md`
