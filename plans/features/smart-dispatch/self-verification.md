# Add Self-Verification Before Review

**Status:** todo
**Priority:** low
**Agent:** Perro salchicha 🌭

## What it does

After coding, before marking the ticket as review, Perro runs a verification pass: checks every checklist item is addressed, validates imports/types aren't broken, and confirms no obvious regressions.

## Checklist

- [ ] Add a "Verify before committing" section to the dispatch prompt
- [ ] Perro re-reads the ticket checklist and confirms each item is done
- [ ] Perro runs `npx tsc --noEmit` (or equivalent type check) if the project supports it
- [ ] If any checklist item is NOT addressed, Perro fixes it before committing
- [ ] If type check fails, Perro fixes errors before committing
- [ ] Only after verification passes does Perro commit and push

## Files

- `~/.openclaw/workspace/skills/autonomous-loop/SKILL.md`
