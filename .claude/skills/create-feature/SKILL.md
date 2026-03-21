---
name: create-feature
description: Use when the user wants to create a new feature (epic) with its tickets. Creates the plan files in plans/features/ following the SPEC.md format.
---

# Create Feature

When this skill is triggered, create a new feature (epic) with its plan files.

## Steps

1. Read `plans/SPEC.md` to confirm the current plan format
2. Ask the user (or infer from context):
   - Feature name (becomes the directory slug in kebab-case)
   - Brief description of what the feature does
   - Initial tickets (tasks to break the feature into)
   - Status and priority (default: `todo` / `medium`)
3. Create the epic directory: `plans/features/<feature-slug>/`
4. Create `_context.md` with the epic overview
5. Create one `.md` file per ticket

## File templates

### `_context.md` (epic)

```markdown
# Feature Title

**Status:** todo
**Priority:** medium

## Overview

What this feature does and why it exists.

## Still needs

- [ ] First ticket description
- [ ] Second ticket description
- [ ] Third ticket description

## Depends on

- Any dependencies on other features or external services
```

### `<ticket-slug>.md` (ticket)

```markdown
# Ticket Title

**Status:** todo
**Priority:** medium

## What it does

Clear description of this specific task.

## Checklist

- [ ] First step
- [ ] Second step
- [ ] Third step
```

## Rules

- **Always read `plans/SPEC.md` first** — it's the source of truth for the format
- Use **kebab-case** for directory and file names: `user-settings/`, `api-keys.md`
- Every epic **must** have a `_context.md` — never skip it
- Break features into **3-7 tickets** — small enough to be actionable, big enough to be meaningful
- The `## Still needs` checklist in `_context.md` should mirror the ticket list
- Status values: `todo`, `in-progress`, `review`, `completed`, `blocked`
- Priority values: `low`, `medium`, `high`, `critical`
- New features default to `todo` / `medium` unless the user says otherwise
- **Only plan files** — this skill creates `.md` files only, never code. The CLAUDE.md already defines how to structure code when it's time to implement
- Write in English
