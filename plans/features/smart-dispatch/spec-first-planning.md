# Add Spec-First Planning Step

**Status:** review
**Priority:** low
**Agent:** Perro salchicha 🌭

## What it does

Before writing any code, Perro generates a mini implementation plan: which files to modify, what the approach is, and what the expected outcome looks like. This catches bad assumptions before they become bad commits.

## Checklist

- [x] Update the autonomous-loop skill dispatch prompt to include a "Plan first" instruction
- [x] Perro writes a `## Implementation Plan` to a temp file before coding
- [x] Plan includes: files to modify, approach per file, expected behavior after changes
- [x] Plan is validated against the ticket checklist — every checklist item should map to at least one planned change
- [x] Only after plan validation does Perro start coding

## Files

- `~/.openclaw/workspace/skills/autonomous-loop/SKILL.md`
