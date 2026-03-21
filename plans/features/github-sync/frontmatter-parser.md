# Frontmatter Parser

**Status:** completed

## What it does

Pure TypeScript functions that parse plan .md files. Extracts title, status, priority from the header, and calculates checklist progress from the body.

## Checklist

- [x] `parsePlan(raw)` → returns `{ title, status, priority, body, checklistTotal, checklistCompleted }`
- [x] Handle `**Status:**` and `**Priority:**` patterns via regex
- [x] Handle `# Title` as h1 title (strips "Feature N:" prefix)
- [x] Count `- [x]` and `- [ ]` for checklist progress
- [x] Strip frontmatter from body for clean content
- [ ] Unit tests for parser

## Location

`convex/model/parsePlan.ts` — runs inside Convex, no external deps
