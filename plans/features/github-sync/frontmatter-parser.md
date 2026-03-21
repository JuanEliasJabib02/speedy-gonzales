# Frontmatter Parser

**Status:** todo

## What it does

Pure TypeScript functions that parse plan .md files. Extracts title, status, priority from the header, and calculates checklist progress from the body.

## Checklist

- [ ] `parsePlan(raw)` → returns { title, status, priority, body, checklistProgress }
- [ ] Handle `**Status:**` and `**Priority:**` patterns
- [ ] Handle `# Title` as h1 title
- [ ] Count `- [x]` and `- [ ]` for checklist progress
- [ ] Strip frontmatter from body for clean content
- [ ] Unit tests for parser

## Location

`convex/model/parsePlan.ts` — runs inside Convex, no external deps
