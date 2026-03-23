# Create Quality Gates Docs Page

**Status:** in-progress
**Priority:** medium
**Agent:** Charizard 🔥

## What it does

Create a new docs page explaining the 3-gate planning quality system. This is a key differentiator — most AI coding tools just dump tasks to agents. Speedy validates plans before execution and verifies results after.

## Checklist

- [ ] Create new page at `src/app/[locale]/(public-routes)/docs/quality-gates/page.tsx`
- [ ] Section 1 — "Why quality gates": the problem with AI coding (vague specs → vague code, no verification → bugs slip through, no codebase awareness → reinvents patterns). One paragraph, direct.
- [ ] Section 2 — "Gate 1: Structured Discussion": before planning, the orchestrator asks targeted questions based on the feature's domain type. Frontend → layout, states, interactions. Backend → auth, errors, pagination. Data model → nullable, cascades, indexes. 3-5 questions max.
- [ ] Section 3 — "Gate 2: Ticket Quality Verification": after creating tickets but before dispatching an agent, a reviewer validates them against the actual codebase. Checks: file paths exist, referenced patterns exist, checklist items are concrete, no ticket conflicts.
- [ ] Section 4 — "Gate 3: UI Contract": every frontend ticket includes a mandatory section specifying layout, states (loading/empty/error), components to reuse, and design tokens. Prevents the agent from inventing its own design system.
- [ ] Section 5 — "Post-Execution Verification": after the agent finishes, a separate agent (fresh context) reviews the diff against the plan checklist. PASS/FAIL with re-dispatch on failure.
- [ ] Section 6 — "Ticket format": show the ideal ticket format with all sections (What it does, Checklist, Files, Patterns to follow, UI Contract). Include a good example and a bad example.
- [ ] Add a flow diagram showing: discuss → research → plan → verify plan → dispatch → code → verify code → review

## Files

- `src/app/[locale]/(public-routes)/docs/quality-gates/page.tsx` — NEW
- `src/app/[locale]/(public-routes)/docs/page.tsx` — add card link

## Patterns to follow

- Reference: `src/app/[locale]/(public-routes)/docs/sync/page.tsx` — same page structure
- Reference: `~/.openclaw/workspace/skills/create-feature/SKILL.md` — the technical spec for the 3-gate system

## UI Contract

- Layout: vertical sections, flow diagram in code block, example ticket in code block
- States: static content
- Reuse: same doc page pattern, highlighted boxes for gate descriptions
- Match: existing docs pages
- Tokens: standard docs tokens. Use colored callout boxes to visually distinguish each gate (but keep within the existing design system — no new colors)
