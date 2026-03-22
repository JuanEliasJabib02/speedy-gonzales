# Loop Trigger — Read Projects and Tickets

**Status:** todo
**Priority:** high
**Agent:** Charizard 🔥

## What it does

The entry point of the autonomous loop. When Charizard receives the loop trigger (via cron or manual command), it queries Convex for active projects and their todo tickets.

This is the Charizard-side logic, NOT Convex. It lives in the autonomous-loop skill.

## Checklist

- [ ] Update the `autonomous-loop` skill (`~/.openclaw/skills/autonomous-loop/SKILL.md`) with concrete Convex HTTP API calls
- [ ] Use Convex HTTP API to call `getActiveLoopProjects` — `POST https://{CONVEX_URL}/api/query` with function path and args
- [ ] For each active project, call `getTodoTicketsByProject` to get the queue
- [ ] If no active projects → log and exit (`HEARTBEAT_OK`)
- [ ] If active projects but no todo tickets → check if all are blocked → notify Juan via Telegram
- [ ] Store the Convex URL in the skill as a configurable reference (read from env or openclaw config)

## Files

- `~/.openclaw/skills/autonomous-loop/SKILL.md`
- `~/.openclaw/workspace/skills/autonomous-loop/SKILL.md` (versioned copy)
