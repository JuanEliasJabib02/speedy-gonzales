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

## Key Rules

- Components are pure UI — all logic in hooks
- Use Convex for all data access (no REST APIs for app data)
- Follow the architecture in `.claude/claude.md`
- Read `.claude/rules/` before making changes
- Use English for all code, comments, and docs
