# AGENTS.md — Speedy Gonzales

This file is read automatically by Claude Code and other AI agents working in this repo.

## Plan Files — MANDATORY RULES

Before creating or editing any file in `plans/features/`, read `plans/SPEC.md`.

### Format

Every plan file MUST start with:
```markdown
# Title

**Status:** todo
**Priority:** medium
```

### Valid values (ONLY these — nothing else)

- **Status:** `todo` | `in-progress` | `review` | `completed` | `blocked`
- **Priority:** `low` | `medium` | `high` | `critical`

❌ NEVER use: `planned`, `done`, `wip`, `pending`, `in_progress`, or any other value.

### Defaults for new files

- Status: `todo`
- Priority: `medium`

### Directory structure

```
plans/features/<epic-slug>/
├── _context.md       ← Required (epic overview)
└── <ticket-slug>.md  ← One per ticket
```

- kebab-case for all directory and file names
- Only 2 levels deep — no nested subdirectories
- Every epic directory MUST have `_context.md`

## When finishing a ticket

Include the branch name and commits in the ticket file:

```markdown
## Branch

feature/ticket-slug

## Commits

- `abc1234` feat(feature): description of what was done
```

This allows Speedy to show the preview URL and commit history in the review flow.

## Commit message conventions

- `feat(plans):` — new ticket created
- `docs(plans):` — ticket updated (status change, checklist)
- `fix(plans):` — correcting a ticket description

## Stack reference

- **Frontend:** Next.js 15 + Tailwind + shadcn/ui
- **DB/Realtime:** Convex
- **Auth:** Convex Auth (magic link)
- **AI:** Vercel AI SDK + OpenClaw API
- **Deployment:** Vercel

When in doubt, check `plans/SPEC.md` for the canonical format.
