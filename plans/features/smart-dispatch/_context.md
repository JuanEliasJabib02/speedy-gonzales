# Smart Dispatch

**Status:** todo
**Priority:** low

## Overview

Upgrade the autonomous-loop to give Perro better context and quality controls per ticket. Inspired by GSD's context engineering approach, but built natively into the skill — no external dependencies.

Currently Perro gets a raw prompt with the ticket plan and codebase access. This works for small tickets but quality drops on complex ones. Smart dispatch adds three layers:

1. **Spec-first execution** — Before coding, Perro writes a mini implementation plan (files to touch, approach, expected outcome). Catches bad assumptions before they become bad code.
2. **Context compression** — For tickets touching many files, Perro summarizes relevant code instead of keeping raw file contents in context. Prevents context rot on long tasks.
3. **Self-verification** — After coding, before marking review: Perro validates against the checklist, checks imports/types, and confirms no regressions. Right now there's no double-check.

## Architecture decisions

- All three layers are prompt additions to the autonomous-loop skill — no code changes in Speedy itself
- Spec-first: Perro writes plan to a temp file, validates against checklist, then executes
- Context compression: for tickets with >5 files in `## Files`, Perro summarizes each before coding
- Self-verification: after `git add`, before committing, Perro runs through a verification checklist

## Still needs

- [ ] Add spec-first planning step to Perro's dispatch prompt
- [ ] Add context compression for large tickets
- [ ] Add self-verification loop before marking review
