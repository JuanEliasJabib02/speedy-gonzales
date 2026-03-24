# Update Autonomous Loop — No .md Status Writes

**Status:** todo
**Priority:** medium
**Agent:** Charizard 🔥

## What it does

Update the autonomous-loop skill in Charizard's workspace so Perro stops writing status fields to `.md` files. Perro's only responsibilities after coding: commit code, push to branch, call `/update-ticket-status` endpoint. No `.md` status edits.

## Checklist

- [ ] Update `~/.openclaw/workspace/skills/autonomous-loop/SKILL.md` — in the Perro dispatch prompt (Step 4c), remove all instructions about updating ticket `.md` status field. Remove: "Update ticket status to review in the .md file"
- [ ] Keep in the prompt: "Call the /update-ticket-status endpoint with status, commits, checklistCompleted, checklistTotal"
- [ ] Update the prompt to pass `commits` array and `checklistCompleted`/`checklistTotal` counts in the endpoint call
- [ ] Remove from prompt: any `sed` or manual `.md` editing for status fields
- [ ] Update Step 4d (monitor) — on success, verify the endpoint was called by checking the response. Don't check `.md` files for status anymore
- [ ] Update AGENTS.md rules — change "Perro updates .md status on the feature branch" to "Perro calls Convex endpoint for status updates. Never write status to .md files."

## Files

- `~/.openclaw/workspace/skills/autonomous-loop/SKILL.md` — modify Perro's dispatch prompt
- `~/.openclaw/workspace/AGENTS.md` — update status-related rules

## Patterns to follow

- Reference: current Perro prompt in `autonomous-loop/SKILL.md` Step 4c — modify the "When done:" section
- The curl call already exists, just needs to include new fields (commits, checklistCompleted)
