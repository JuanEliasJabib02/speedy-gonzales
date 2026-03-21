---
name: create-ticket
description: Use when you need to add a new ticket to an existing feature. Creates a single ticket .md file inside plans/features/<epic>/ following the SPEC.md format.
---

# Create Ticket

When this skill is triggered, create a new ticket inside an existing feature (epic).

## Steps

1. Read `plans/SPEC.md` to confirm the current plan format
2. Identify the target epic directory under `plans/features/<epic-slug>/`
3. Ask the user (or infer from context):
   - Ticket title (becomes the file slug in kebab-case)
   - What the ticket does
   - Initial checklist steps
   - Status and priority (default: `todo` / `medium`)
4. Create `plans/features/<epic-slug>/<ticket-slug>.md`
5. Update the epic's `_context.md` — add the new ticket to the `## Still needs` checklist

## File template

### `<ticket-slug>.md`

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

## Files

- `path/to/relevant/file.tsx`
```

## Rules

- **Always read `plans/SPEC.md` first** — it's the source of truth for the format
- Use **kebab-case** for file names: `streaming-support.md`, `commit-cards.md`
- The ticket file goes inside the **existing** epic directory — never create a new epic directory
- If the epic directory doesn't exist, ask the user which feature this ticket belongs to
- After creating the ticket, **always update `_context.md`** to add the ticket to `## Still needs`
- Status values: `todo`, `in-progress`, `review`, `completed`, `blocked`
- Priority values: `low`, `medium`, `high`, `critical`
- New tickets default to `todo` / `medium` unless the user says otherwise
- **Only plan files** — this skill creates `.md` files only, never code
- Write in English
- Keep the `## Files` section if relevant source files are known, omit it otherwise
