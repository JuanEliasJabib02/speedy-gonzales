# Write Commit SHAs to Ticket Files

**Status:** todo
**Priority:** high
**Agent:** Perro salchicha 🌭

## What it does

After Perro pushes code for a ticket, the autonomous-loop skill should append a `## Commits` section to the ticket `.md` file with the commit SHAs. The sync engine already parses this field and the PlanViewer already renders commit cards with diffs — the only missing piece is writing the data.

## Checklist

- [ ] In the autonomous-loop skill, after Perro pushes, extract the commit SHA(s) from `git log`
- [ ] Append a `## Commits` section to the ticket `.md` before changing status to `review`
- [ ] Format: one SHA per line, e.g. `- abc1234`
- [ ] Verify the sync engine picks up the commits and they appear in the PlanViewer

## Files

- `~/.openclaw/workspace/skills/autonomous-loop/SKILL.md`
- `~/.openclaw/workspace/skills/autonomous-loop/scripts/` (if applicable)
