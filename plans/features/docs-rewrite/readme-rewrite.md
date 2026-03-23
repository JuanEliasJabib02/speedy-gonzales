# Rewrite README.md

**Status:** todo
**Priority:** high
**Agent:** Charizard 🔥

## What it does

Complete rewrite of the repository README.md. The current version is good but has gaps — doesn't mention the autonomous loop, quality gates, or how to actually set up the project end-to-end. Also needs to be generic (no personal agent names for the main pitch — those go in docs/philosophy).

## Checklist

- [ ] Rewrite hero section: "You write the plan. AI builds it while you sleep." — keep this, it's good
- [ ] Update "How it works" flow diagram to include quality gates and verification step
- [ ] Rewrite "Why Speedy" bullets to cover all 8 core features: plans as code, real-time kanban, autonomous loop, stack-agnostic, agent-agnostic, quality gates, human review gate, multi-project
- [ ] Update architecture diagram — current one is good but missing the verification agent and quality gates
- [ ] Add "Core Concepts" section: quick explanation of epics, tickets, the plan spec, status lifecycle (todo → in-progress → review → completed)
- [ ] Update "Getting Started" section with complete steps: clone, install, configure Convex, create first project, add plans, run the loop
- [ ] Add "Configuration" section: environment variables needed (LOOP_API_KEY, GITHUB_WEBHOOK_SECRET, etc.)
- [ ] Keep tech stack section, verify it's current
- [ ] Add "Documentation" section linking to `/docs` pages
- [ ] Keep author section and license
- [ ] Remove any references to specific agent names (Charizard, Perro) from the main README — use generic "orchestrator" and "coding agent"

## Files

- `README.md` — full rewrite

## Patterns to follow

- Reference: current `README.md` — keep the diagram style and overall structure, just update content
- Tone: direct, no fluff, developer-facing. Similar to the current README but more complete.
