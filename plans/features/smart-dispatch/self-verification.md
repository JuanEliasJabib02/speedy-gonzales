# Add Self-Verification Before Review

**Status:** review
**Priority:** low
**Agent:** Perro salchicha 🌭

## What it does

After coding, before marking the ticket as review, Perro runs a verification pass: checks every checklist item is addressed, validates imports/types aren't broken, and confirms no obvious regressions.

## Checklist

- [x] Add a "Verify before committing" section to the dispatch prompt
- [x] Perro re-reads the ticket checklist and confirms each item is done
- [x] Perro runs `npx tsc --noEmit` (or equivalent type check) if the project supports it
- [x] If any checklist item is NOT addressed, Perro fixes it before committing
- [x] If type check fails, Perro fixes errors before committing
- [x] Only after verification passes does Perro commit and push

## Files

- `~/.openclaw/workspace/skills/autonomous-loop/SKILL.md`
