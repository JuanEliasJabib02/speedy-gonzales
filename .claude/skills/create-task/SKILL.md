---
name: create-task
description: Use when the user wants to create a task file to track work. Saves a structured markdown file inside `.claude/tasks/` with context, scope, and creation date.
---

# Create Task

When this skill is triggered, create a task file about a specific topic.

## Steps

1. Ask the user what the task is about (or infer from context)
2. Create a markdown file inside `.claude/tasks/`
3. Include the creation date in the filename (e.g. `task-name-2026-03-14.md`)

## File format

```markdown
# <Task Title>

**Created:** YYYY-MM-DD
**Status:** open

## Context
Why this task was created and what triggered it.

## Scope
What specifically needs to be done.

## Notes
Any relevant details, blockers, or references.
```

## Rules
- All task files must be written in English — titles, descriptions, context, and notes
- Use kebab-case for filenames
- Keep the scope focused — one task per file
