# Preview Branches Workflow

**Status:** todo
**Priority:** medium

## What it does

Document and configure the branch strategy for using Vercel preview deployments in the development workflow. Each feature branch gets an isolated preview URL so tickets can be reviewed live before merging to main.

## The workflow

```
main       → production (speedy-gonzales.vercel.app)
develop    → staging (speedy-gonzales-develop.vercel.app)
feature/*  → preview (speedy-gonzales-feature-chat.vercel.app)
```

Perro Salchicha works on `feature/*` branches. Each push creates a Vercel preview URL automatically. Juan reviews on the preview URL before merging.

## Setup steps (one-time)

- [ ] Create `develop` branch from main
- [ ] In Vercel dashboard → Settings → Git → set Production Branch to `main`
- [ ] Vercel auto-creates preview deployments for all other branches (no config needed)
- [ ] Add `VERCEL_PROJECT_NAME` env var to `.env.local` so Speedy can derive preview URLs
- [ ] Document in `/docs/setup` — add "Preview Branches" section

## How preview URLs work

Vercel derives the preview URL from the branch name:
```
Branch: feature/syntax-highlighting
URL: https://speedy-gonzales-git-feature-syntax-highlighting-{username}.vercel.app
```

Or use the Vercel API to get the exact URL for each deployment.

## Agent instructions update

Update the system prompt in `route.ts` to tell the agent:
- When finishing a ticket, include the branch name in the plan file under `## Branch`
- This allows Speedy to show the preview URL in the PlanViewer review flow

## Checklist

- [ ] Create `develop` branch
- [ ] Verify Vercel auto-creates preview deployments for feature branches
- [ ] Add VERCEL_PROJECT_NAME to env vars
- [ ] Add docs page or section explaining the preview branch workflow
- [ ] Update agent system prompt to include branch name in ticket files

## Files

- `src/app/[locale]/(public-routes)/docs/setup/page.tsx` — add Preview Branches section
- `src/app/api/chat/route.ts` — update system prompt with branch instructions
