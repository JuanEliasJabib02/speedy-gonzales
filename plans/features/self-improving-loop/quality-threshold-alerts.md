# Quality Threshold Alerts

**Status:** backlog
**Priority:** medium
**Agent:** Charizard 🔥

## What it does

When the clean approval rate for a repo drops below 80% over a week, notify Juan with a summary of what's going wrong and suggest .claude/ config improvements.

## Checklist

- [ ] During heartbeat or loop cycle, check weekly quality rate per project
- [ ] If quality rate < 80%: analyze the "with-fixes" tickets from that week
- [ ] Group by pattern (what type of fix was needed most)
- [ ] Send notification: "Quality dropped to X% on {repo}. Top issues: {patterns}. Suggested rules: {rules}"
- [ ] Include a link or diff of suggested .claude/rules/ additions

## Files

- `~/.openclaw/workspace/skills/autonomous-loop/SKILL.md`
