# Plan Spec v1

This is the canonical format for plan files in Speedy Gonzales. The sync engine, the parser, and the AI agent all follow this spec. If this file and the code disagree, update the code.

## Directory structure

```
plans/
├── features/
│   ├── <epic-slug>/
│   │   ├── _context.md       # Required — epic overview
│   │   ├── <ticket-slug>.md  # One file per ticket
│   │   └── <ticket-slug>.md
│   ├── <epic-slug>/
│   │   ├── _context.md
│   │   └── ...
├── business-model.md          # Optional — project-level docs
├── design-system.md           # Optional — project-level docs
├── roadmap.md                 # Optional — project-level docs
└── SPEC.md                    # This file
```

### Rules

- **`plans/features/`** is the sync root. Only files under this path are synced to Convex.
- Each **subdirectory** under `features/` is an **epic** (feature).
- Each epic **must** have a `_context.md` file. Without it, the epic has no title or metadata.
- Each **`.md` file** (other than `_context.md`) in an epic directory is a **ticket**.
- Only **2 levels deep**: `features/<epic>/<file>.md`. Nested subdirectories are ignored.
- Use **kebab-case** for directory and file names: `github-sync`, `create-dialog.md`.
- Files outside `features/` (like `business-model.md`) are **not synced** — they're reference docs only.

## File format — `_context.md` (epic)

```markdown
# Epic Title

**Status:** todo
**Priority:** medium

## Overview

Brief description of what this feature does and why it exists.

## UI built (mock)

- [x] Component or screen that's been built
- [x] Another completed piece
- [ ] Something still needed

## Components

- `ComponentName` — short description

## Still needs

- [ ] What's left to wire up or build

## Depends on

- Other epic or external dependency
```

### Parsed fields

| Field | Source | Default | Allowed values |
|-------|--------|---------|----------------|
| `title` | First `# Heading` | Directory name | Any string |
| `status` | `**Status:**` value | `todo` | `todo`, `in-progress`, `review`, `completed`, `blocked` |
| `priority` | `**Priority:**` value | `medium` | `low`, `medium`, `high`, `critical` |
| `body` | Everything after the header block | `""` | Markdown |
| `checklistTotal` | Count of `- [x]` + `- [ ]` | `0` | Number |
| `checklistCompleted` | Count of `- [x]` | `0` | Number |

### Parser behavior

1. Title is extracted from the first `# ` heading. The prefix `Feature N:` is stripped if present.
2. `**Status:**` and `**Priority:**` are parsed as bold-colon fields immediately after the title.
3. `**Phase:**` is also stripped from the header block (legacy field).
4. The body is everything after the title + metadata lines.
5. Checklists (`- [x]` and `- [ ]`) are counted across the entire file.

## File format — ticket `.md`

```markdown
# Ticket Title

**Status:** todo
**Priority:** medium

## What it does

Description of this specific task or piece of work.

## Checklist

- [x] Step that's been completed
- [ ] Step still pending
- [ ] Another pending step

## Files

- `path/to/relevant/file.tsx`
```

Tickets use the **exact same parser** as epics. Same fields, same defaults, same rules.

## Status values

| Value | Meaning |
|-------|---------|
| `todo` | Not started |
| `in-progress` | Actively being worked on |
| `review` | Done, waiting for review |
| `completed` | Shipped |
| `blocked` | Waiting on a dependency |

## Priority values

| Value | Meaning |
|-------|---------|
| `low` | Nice to have |
| `medium` | Normal priority (default) |
| `high` | Important, do soon |
| `critical` | Must be done now |

## Sections convention

These sections are optional but conventional. Use them when relevant:

| Section | Used in | Purpose |
|---------|---------|---------|
| `## Overview` | Epics | What the feature does |
| `## What it does` | Tickets | What the task does |
| `## UI built (mock)` | Epics | Checklist of built UI pieces |
| `## Components` | Epics | List of extracted components |
| `## Hooks` | Epics | List of custom hooks |
| `## Checklist` | Tickets | Step-by-step task checklist |
| `## Files` | Tickets | Relevant source files |
| `## Still needs` | Both | What's left to do |
| `## Depends on` | Both | Dependencies on other epics or external things |
| `## Routes` | Epics | URL paths this feature owns |
| `## What's built` | Epics | Prose description of current state |

## Examples

### Minimal epic (`_context.md`)

```markdown
# Auth

**Status:** completed
**Priority:** critical

Email OTP login with Convex Auth. Protects all app routes.
```

### Minimal ticket

```markdown
# Create Project Dialog

**Status:** in-progress

## Checklist

- [x] Dialog component with form fields
- [ ] Wire to Convex mutation
- [ ] Add validation
```

## Versioning

This is **v1** of the plan spec. If the format changes, bump the version and update the parser.
