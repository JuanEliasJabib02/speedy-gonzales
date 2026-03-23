# Docs Rewrite — Full Documentation Overhaul

**Status:** todo
**Priority:** high

## Overview

Complete rewrite of the public documentation pages and README to accurately reflect Speedy Gonzales as it exists today. Current docs are outdated — they reference features that don't exist (chat), miss features that do exist (autonomous loop, quality gates, multi-agent), and the roadmap is stale.

Target audience: **open source users** who find the repo on GitHub and want to understand what Speedy is, how it works, and how to use it for their own projects.

## Decisions (from discuss)

- Docs live as React pages in `src/app/[locale]/(public-routes)/docs/` — keep this pattern
- README.md stays focused and punchy (what it is, how it works, getting started, architecture)
- Remove all personal references (Charizard, Perro salchicha, Juan's Telegram) from public docs — make them generic
- Delete `.perro-queue.md` (stale, references dead features)
- Existing page structure: keep most routes, add new ones for autonomous loop and quality gates, remove/merge redundant ones (ai-workflow and agent-workflow are basically the same page)

## Architecture

- Existing docs pages follow a consistent pattern: Back link, h1, subtitle, sections with h2
- All use Tailwind + Lucide icons, no shadcn components in docs pages
- Docs layout in `src/app/[locale]/(public-routes)/docs/layout.tsx`
- No MDX — all content is hardcoded JSX (keeps styling consistent)

## Current pages (8 total)

1. `/docs` — index with Getting Started cards + Features cards + Roadmap
2. `/docs/philosophy` — why Speedy exists (KEEP, update)
3. `/docs/setup` — setup guide (KEEP, update heavily)
4. `/docs/plans` — plan structure spec (KEEP, update)
5. `/docs/source-of-truth` — git as truth (KEEP, update)
6. `/docs/feature-view` — feature view UI (KEEP, update)
7. `/docs/sync` — GitHub auto-sync (KEEP, update)
8. `/docs/ai-workflow` — AI workflow (REWRITE as autonomous loop)
9. `/docs/agent-workflow` — agent workflow (MERGE into ai-workflow, delete this page)

## New pages to add

10. `/docs/autonomous-loop` — the 24/7 dev loop (replaces ai-workflow)
11. `/docs/quality-gates` — the 3-gate planning system

## Still needs

- [x] Research existing docs structure and content
- [ ] Rewrite README.md
- [ ] Update docs index page (cards, roadmap, descriptions)
- [ ] Rewrite philosophy page (remove personal details, make universal)
- [ ] Rewrite setup guide (complete onboarding flow)
- [ ] Update plan structure page
- [ ] Update source of truth page
- [ ] Update feature view page
- [ ] Rewrite sync page
- [ ] Create autonomous loop page (replace ai-workflow)
- [ ] Create quality gates page
- [ ] Delete agent-workflow page (merge into autonomous loop)
- [ ] Delete `.perro-queue.md`
- [ ] Update AGENTS.md

## Depends on

- Nothing — docs are independent of code features
