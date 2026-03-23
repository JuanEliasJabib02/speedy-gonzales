# Cleanup Stale Files + Update Feature View Docs

**Status:** todo
**Priority:** medium
**Agent:** Charizard 🔥

## What it does

Delete stale files from the repo and update the feature view docs page. Also update AGENTS.md to reflect the current workflow including quality gates.

## Checklist

- [ ] Delete `.perro-queue.md` — stale, references dead features (chat, roadmap modal, paste image upload)
- [ ] Update `src/app/[locale]/(public-routes)/docs/feature-view/page.tsx` — verify it matches the current UI (ticket sidebar, plan viewer, commit timeline). Remove references to chat panel if any exist.
- [ ] Check and update sub-pages: `src/app/[locale]/(public-routes)/docs/feature-view/plan-viewer/page.tsx` and `src/app/[locale]/(public-routes)/docs/feature-view/ticket-sidebar/page.tsx` — make sure they reflect current functionality
- [ ] Update `AGENTS.md` — add section about quality gates (3-gate system) and post-execution verification. This is what AI agents read when they land in the repo.
- [ ] Verify all internal links across docs pages work (no broken links to deleted pages like `/docs/ai-workflow` or `/docs/agent-workflow`)

## Files

- `.perro-queue.md` — DELETE
- `src/app/[locale]/(public-routes)/docs/feature-view/page.tsx` — update if needed
- `src/app/[locale]/(public-routes)/docs/feature-view/plan-viewer/page.tsx` — update if needed
- `src/app/[locale]/(public-routes)/docs/feature-view/ticket-sidebar/page.tsx` — update if needed
- `AGENTS.md` — update with quality gates info

## Patterns to follow

- Reference: current feature-view docs pages — keep the structure, just verify accuracy
- Reference: `~/.openclaw/workspace/skills/create-feature/SKILL.md` — for quality gates content to add to AGENTS.md
