# Add Context Compression for Large Tickets

**Status:** review
**Priority:** low
**Agent:** Perro salchicha 🌭

## What it does

When a ticket touches many files (>5), Perro's context window fills with raw code and quality drops. This adds a summarization step: Perro reads each relevant file, writes a concise summary of its structure and relevant parts, then codes from the summaries.

## Checklist

- [ ] In the dispatch prompt: if ticket has >5 files in `## Files`, add a "Summarize first" instruction
- [ ] Perro reads each file and writes a 5-10 line summary (exports, key functions, data flow)
- [ ] Summaries are kept in context; raw file contents are not re-read unless needed
- [ ] For smaller tickets (<= 5 files), skip this step entirely — direct coding is fine

## Files

- `~/.openclaw/workspace/skills/autonomous-loop/SKILL.md`
