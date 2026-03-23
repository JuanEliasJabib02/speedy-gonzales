# Rewrite Setup Guide + Plan Structure Pages

**Status:** todo
**Priority:** high
**Agent:** Charizard 🔥

## What it does

Complete rewrite of the setup guide and plan structure docs. Setup needs to be a real onboarding flow — from zero to working project. Plan structure needs to match the current SPEC.md exactly and explain the format clearly for someone who's never seen it.

## Checklist

- [ ] Rewrite setup page with complete flow: prerequisites → clone/fork → install deps → configure Convex → create first project → create plans directory → add first epic + ticket → configure webhook → test sync → (optional) set up autonomous loop
- [ ] Add prerequisites section: Node.js, pnpm, Convex account, GitHub account, (optional) OpenClaw for autonomous loop
- [ ] Add environment variables reference: `NEXT_PUBLIC_CONVEX_URL`, `CONVEX_DEPLOYMENT`, `LOOP_API_KEY`, `GITHUB_WEBHOOK_SECRET`
- [ ] Add troubleshooting section: common issues (webhook not firing, sync not updating, auth issues)
- [ ] Rewrite plan structure page to match `plans/SPEC.md` exactly — directory structure, `_context.md` format, ticket `.md` format, parsed fields table, status/priority values
- [ ] Add example epic with 2 tickets showing real content (not placeholder lorem ipsum)
- [ ] Explain the naming rules: kebab-case, never rename after creation, why paths matter
- [ ] Add section on checklist tracking: `[x]` and `[ ]` are parsed and shown as progress in the UI

## Files

- `src/app/[locale]/(public-routes)/docs/setup/page.tsx` — full rewrite
- `src/app/[locale]/(public-routes)/docs/plans/page.tsx` — full rewrite

## Patterns to follow

- Reference: current `src/app/[locale]/(public-routes)/docs/setup/page.tsx` — keep the numbered step cards style, it's clear
- Reference: `plans/SPEC.md` — the spec is the source of truth for the plan structure page
- Reference: `plans/features/auto-sync/_context.md` and `plans/features/auto-sync/upsert-logic.md` — use as real examples in the docs

## UI Contract

- Layout: vertical sections, numbered step cards for setup flow, code blocks for file examples
- States: static content, no dynamic data
- Reuse: same step card pattern from current setup page (numbered circles + label + description)
- Match: current docs pages
- Tokens: code blocks use `rounded-lg bg-muted p-4 text-sm`, inline code uses `rounded bg-muted px-1.5 py-0.5 text-sm`
