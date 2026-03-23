# Update Docs Index + Philosophy Page

**Status:** review
**Priority:** high
**Agent:** Charizard 🔥

## What it does

Rewrite the docs index page (`/docs`) and philosophy page (`/docs/philosophy`). The index needs updated cards, descriptions, and a current roadmap. Philosophy needs to be more universal — less "I built this for me" and more "this is for builders who use AI agents."

## Checklist

- [x] Update docs index page cards — add Autonomous Loop and Quality Gates, remove redundant AI Workflow card
- [x] Rewrite card descriptions to match current feature set
- [x] Rewrite roadmap section — update done/in-progress/next items to reflect reality (auto-sync done, feature view done, kanban done, autonomous loop in-progress, multi-project next, etc.)
- [x] Update hero text: change "The AI Agents IDE" to something more accurate — "Autonomous Development Orchestrator" or similar
- [x] Rewrite philosophy page — keep the core message (speed, AI-first, plans in git) but make it less personal. Remove first-person "I built this" and make it about the principles. Keep Juan's credit but frame it as project origin, not personal blog.
- [x] Add link cards for new docs pages (autonomous-loop, quality-gates)

## Files

- `src/app/[locale]/(public-routes)/docs/page.tsx` — update cards, roadmap, hero
- `src/app/[locale]/(public-routes)/docs/philosophy/page.tsx` — rewrite content

## Patterns to follow

- Reference: current `src/app/[locale]/(public-routes)/docs/page.tsx` — keep the CardGrid component, section layout, roadmap list style
- Reference: current `src/app/[locale]/(public-routes)/docs/philosophy/page.tsx` — keep the section structure with h2 + paragraphs + highlighted boxes

## UI Contract

- Layout: keep existing — vertical sections, card grid for links, list for roadmap
- States: static content, no loading/empty/error needed
- Reuse: CardGrid component already exists in docs index, reuse it
- Match: current docs pages — same spacing, typography, muted-foreground for body text
- Tokens: `text-3xl font-semibold tracking-tight` for h1, `text-xl font-semibold` for h2, `text-muted-foreground` for body

## Commits

- 5fb5f5f64b93627f770dd28b10666399e84edb93
