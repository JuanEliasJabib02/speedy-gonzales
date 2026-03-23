# AGENTS.md — Speedy Gonzales

## Project

- **Name:** Speedy Gonzales
- **Stack:** Next.js 15 (App Router) + Convex + Tailwind + shadcn/ui
- **Repo:** github.com/JuanEliasJabib02/speedy-gonzales
- **Hosting:** Vercel (auto-deploys from `main`)

## Git Workflow

- **Production branch:** `main`
- **Base branch:** `main` (all feature branches fork from here)
- **PR target:** `main`
- **Branch naming:** `feat/<ticket-slug>` (e.g. `feat/chat-pagination`)
- **Never push directly to:** `main`

### Rules for AI agents (Perro salchicha)

1. Always create a feature branch from `main`: `git checkout main && git pull && git checkout -b feat/<ticket-slug>`
2. Work on the feature branch — commit freely with conventional commits
3. Push the feature branch: `git push -u origin feat/<ticket-slug>`
4. **Create a PR** to `main` — never merge it. Juan reviews and merges.
5. After pushing, trigger Convex sync so tickets update in the dashboard

### Commit conventions

- `feat(<scope>): description` — new features
- `fix(<scope>): description` — bug fixes
- `docs(<scope>): description` — documentation, plan updates
- `refactor(<scope>): description` — code restructuring
- `chore(<scope>): description` — tooling, config, deps

Scope is usually the ticket slug or feature area (e.g. `feat(chat-pagination): add infinite scroll`).

## Plan Files

- Location: `plans/features/<epic-slug>/<ticket-slug>.md`
- Format: Speedy Gonzales spec (see `plans/SPEC.md`)
- Valid statuses: `todo`, `in-progress`, `review`, `completed`, `blocked`
- Valid priorities: `low`, `medium`, `high`, `critical`
- Agent workflow: move to `review` when done, never to `completed`

## Convex Sync

After pushing changes that modify plan files, trigger sync:

```bash
curl -s -X POST "https://necessary-fish-66.convex.site/github-webhook" \
  -H "Content-Type: application/json" \
  -H "x-github-event: push" \
  -d '{"repository": {"owner": {"login": "JuanEliasJabib02"}, "name": "speedy-gonzales"}, "commits": [{"modified": ["plans/features/chat/_context.md"]}]}'
```

## Quality Gates (3-Gate System)

Every feature goes through three quality gates before any code is written. This ensures tickets are solid, specific, and verifiable.

### Gate 1 — Structured Discuss

Before writing any plans, Charizard asks 3-5 targeted questions based on the feature's domain (frontend, backend, data model, integration, or refactor). These surface decisions that would be expensive to change later. If the answer is "you decide," the agent decides and documents it.

### Gate 2 — Ticket Quality Verification

After creating all tickets but before dispatching Perro salchicha, a quality check validates:
- File paths in `## Files` exist (for modifications) or make sense (for new files)
- Patterns in `## Patterns to follow` reference real, existing code
- Each checklist item is specific enough to implement without guessing
- No conflicts between tickets modifying the same file
- Dependency order is correct (no ticket references code from a later ticket)
- Frontend tickets have a `## UI Contract`

**Verdict:** PASS → dispatch. FAIL → fix and re-verify (max 1 retry).

### Gate 3 — UI Contract (Frontend Tickets)

Every ticket that touches `.tsx` or UI components must include a `## UI Contract` specifying:
- **Layout** — how elements are arranged
- **States** — what renders for loading, empty, error, success
- **Reuse** — existing components to use (don't reinvent)
- **Match** — which existing page/component this should visually resemble
- **Tokens** — specific tailwind classes, color tokens, spacing

### Post-Execution Verification

After Perro salchicha finishes a ticket, the agent:
1. Re-reads the ticket checklist — confirms every item is addressed
2. Runs `npx tsc --noEmit` to catch type errors
3. Fixes any issues found before committing
4. Updates ticket status to `review` and marks checklist items `[x]` in the same commit as the code
5. Pushes and notifies — Juan reviews and moves to `completed`

**Agents never mark tickets as `completed`** — only `review`. Human review is the final gate.

## Key Rules

- Components are pure UI — all logic in hooks
- Use Convex for all data access (no REST APIs for app data)
- Follow the architecture in `.claude/claude.md`
- Read `.claude/rules/` before making changes
- Use English for all code, comments, and docs
