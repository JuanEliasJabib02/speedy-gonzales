# Update Autonomous Loop to Call Status Endpoint

**Status:** todo
**Priority:** high
**Agent:** Charizard 🔥

## What it does

Updates the autonomous-loop skill so that after Perro finishes each ticket on a feature branch, the loop calls the new `/update-ticket-status` endpoint. This makes the kanban move in real time instead of waiting for the PR merge.

This is NOT a code ticket — it updates the skill definition in the Charizard workspace.

## Checklist

- [ ] After each ticket completes (review or blocked), add a curl call to `/update-ticket-status` in the Perro dispatch prompt
- [ ] Call format: `curl -s -X POST "https://necessary-fish-66.convex.site/update-ticket-status" -H "Content-Type: application/json" -d '{"repoOwner": "{repoOwner}", "repoName": "{repoName}", "ticketPath": "{ticket.path}", "status": "review"}'`
- [ ] For blocked tickets, include `blockedReason` in the payload
- [ ] Update the skill in `~/.openclaw/workspace/skills/autonomous-loop/SKILL.md`
- [ ] Sync to `~/.openclaw/skills/autonomous-loop/SKILL.md` (global skills)
- [ ] Commit and push workspace changes

## Files

- `~/.openclaw/workspace/skills/autonomous-loop/SKILL.md`
