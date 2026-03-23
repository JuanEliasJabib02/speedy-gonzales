# Add Spec-First Planning Step

**Status:** todo
**Priority:** low
**Agent:** Perro salchicha 🌭

## What it does

Before writing any code, Perro generates a mini implementation plan: which files to modify, what the approach is, and what the expected outcome looks like. This catches bad assumptions before they become bad commits.

## Checklist

- [ ] Update the autonomous-loop skill dispatch prompt to include a "Plan first" instruction
- [ ] Perro writes a `## Implementation Plan` to a temp file before coding
- [ ] Plan includes: files to modify, approach per file, expected behavior after changes
- [ ] Plan is validated against the ticket checklist — every checklist item should map to at least one planned change
- [ ] Only after plan validation does Perro start coding

## Files

- `~/.openclaw/workspace/skills/autonomous-loop/SKILL.md`
