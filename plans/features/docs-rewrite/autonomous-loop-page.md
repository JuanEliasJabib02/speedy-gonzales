# Create Autonomous Loop Docs Page

**Status:** todo
**Priority:** high
**Agent:** Charizard 🔥

## What it does

Create a new docs page explaining the autonomous development loop — the core differentiator of Speedy. This replaces the outdated `/docs/ai-workflow` page. Explains how the loop works, how to configure it, and what happens at each step.

## Checklist

- [ ] Create new page at `src/app/[locale]/(public-routes)/docs/autonomous-loop/page.tsx`
- [ ] Section 1 — "What is the autonomous loop": overview diagram showing the cycle (query tickets → pick highest priority → dispatch agent → code → push → verify → update status → repeat)
- [ ] Section 2 — "How it works": detailed step-by-step explanation. Every 30 min, the orchestrator queries Convex for `todo` tickets in projects with `autonomousLoop: true`. Picks by priority. Checks file dependencies to avoid conflicts. Dispatches a coding agent with the ticket plan.
- [ ] Section 3 — "The coding agent": what happens inside each dispatch. Fresh context, reads `.claude/` conventions, follows the checklist, pushes to feature branch, marks ticket as `review`. Generic — don't name specific agents.
- [ ] Section 4 — "Verification": after the agent finishes, a separate verification agent reviews the diff against the plan. PASS → stays in review. FAIL → re-dispatch with feedback.
- [ ] Section 5 — "Configuration": what env vars are needed (`LOOP_API_KEY`), project settings (`autonomousLoop`, `localPath`, `maxConcurrentPerFeature`, `maxConcurrentGlobal`), how to enable per project
- [ ] Section 6 — "Rate limit handling": what happens when the AI provider rate limits — automatic fallback to a smaller model, skip to next cycle if all models exhausted
- [ ] Section 7 — "Notifications": the orchestrator notifies on ticket success, block, crash, and epic completion
- [ ] Delete `src/app/[locale]/(public-routes)/docs/ai-workflow/page.tsx` — replaced by this page
- [ ] Delete `src/app/[locale]/(public-routes)/docs/agent-workflow/page.tsx` — merged into this page
- [ ] Update any internal links that pointed to `/docs/ai-workflow` or `/docs/agent-workflow` → point to `/docs/autonomous-loop`

## Files

- `src/app/[locale]/(public-routes)/docs/autonomous-loop/page.tsx` — NEW
- `src/app/[locale]/(public-routes)/docs/ai-workflow/page.tsx` — DELETE
- `src/app/[locale]/(public-routes)/docs/agent-workflow/page.tsx` — DELETE
- `src/app/[locale]/(public-routes)/docs/page.tsx` — update links

## Patterns to follow

- Reference: `src/app/[locale]/(public-routes)/docs/sync/page.tsx` — same page structure with Back link, h1, subtitle, sections
- Reference: `~/.openclaw/workspace/skills/autonomous-loop/SKILL.md` — the technical spec for how the loop actually works (but write docs in user-friendly language, not agent instructions)

## UI Contract

- Layout: vertical sections, diagrams in code blocks, step cards for the flow
- States: static content
- Reuse: Back link pattern, section h2 pattern from other docs pages
- Match: existing docs pages — same typography, spacing, card styles
- Tokens: standard docs tokens. Use highlighted boxes (`rounded-lg border border-primary/20 bg-primary/5 p-4`) for important callouts
