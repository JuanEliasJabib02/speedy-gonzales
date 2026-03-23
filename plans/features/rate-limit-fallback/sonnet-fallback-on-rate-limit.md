# Detect Rate Limit and Retry with Sonnet Fallback

**Status:** todo
**Priority:** high
**Agent:** Perro salchicha 🌭

## What it does

When the autonomous loop dispatches Perro and he hits Claude Max's rate limit (exit code 1, output contains "You've hit your limit"), the loop should automatically retry the same ticket using Sonnet instead of stopping.

## Checklist

- [ ] In the autonomous-loop skill (Step 4d - Monitor): after Perro exits with code != 0, check output for rate limit indicators ("You've hit your limit", "rate limit", "resets")
- [ ] If rate limit detected: retry the same ticket with `claude --print --model claude-sonnet-4-20250514 --permission-mode bypassPermissions`
- [ ] If Sonnet also hits rate limit: mark ticket as "rate-limited" (not blocked), skip to next cron cycle
- [ ] Add a `--model` parameter to the dispatch prompt template so it's easy to swap models
- [ ] Log which model was used in the notification: "✅ ticket-name → review (via Sonnet fallback)"
- [ ] Next cron cycle always tries Opus first (default behavior, no change needed)

## Files

- `~/.openclaw/workspace/skills/autonomous-loop/SKILL.md`
