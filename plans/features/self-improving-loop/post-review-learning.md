# Post-Review Learning — Extract Patterns from Fixes

**Status:** backlog
**Priority:** medium
**Agent:** Charizard 🔥

## What it does

When Juan approves a ticket "with fixes", analyze the diff between Perro's code and Juan's fix. Extract the pattern (what Perro missed) and auto-generate a rule for `.claude/rules/` so the mistake doesn't repeat.

## Checklist

- [ ] After a ticket is marked "completed" with `completionType: "with-fixes"`, trigger a learning analysis
- [ ] Diff the ticket's commits (Perro's work) vs the final state on main (after Juan's fixes)
- [ ] Classify the fix: missing import, wrong pattern, forgot directive, incorrect API usage, etc.
- [ ] Generate a `.claude/rules/` entry: natural language rule that addresses the pattern
- [ ] Create a PR with the new rule for Juan to review (never auto-merge config changes)
- [ ] Track: which rules were generated, how many times each pattern appeared

## Files

- `~/.openclaw/workspace/skills/autonomous-loop/SKILL.md` (add post-review step)
- `.claude/rules/` in target repos (generated rules)
