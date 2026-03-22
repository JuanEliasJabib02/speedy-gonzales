# OpenClaw Cron Configuration

**Status:** todo
**Priority:** medium
**Agent:** Charizard 🔥

## What it does

Configure the OpenClaw cron jobs that trigger the autonomous loop and the daily report. This is infrastructure setup, not code — it's about registering the right cron entries in OpenClaw.

## Cron jobs needed

1. **Autonomous loop** — every 30 minutes, 24/7
   - Triggers the `autonomous-loop` skill
   - Charizard reads active projects from Convex and dispatches work

2. **Daily report** — 8:00 AM Bogotá (13:00 UTC) every day
   - Generates a summary of overnight work
   - Posts to Slack per project

## Checklist

- [ ] Register loop cron: `openclaw cron add "*/30 * * * *" --label "autonomous-loop" --message "Run the autonomous dev loop"`
- [ ] Register report cron: `openclaw cron add "0 13 * * *" --label "dev-loop-report" --message "Send the autonomous dev loop daily report"`
- [ ] Verify crons appear in `openclaw cron list`
- [ ] Test: manually trigger the loop cron and verify it fires the skill
- [ ] Document the cron entries in TOOLS.md

## Files

- OpenClaw cron configuration (not code files)
- `~/.openclaw/workspace/TOOLS.md` — document cron entries
