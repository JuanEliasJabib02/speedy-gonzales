# Vercel Auto-Deploy Setup

**Status:** todo
**Priority:** high

## What it does

Connect the GitHub repo to Vercel so every push to `main` triggers an automatic deploy. This closes the loop: agent pushes code → Vercel builds → changes are live in minutes, with no manual `git pull` needed.

## Setup steps (one-time)

1. Go to vercel.com → Add New Project → Import from GitHub
2. Select the repo (`speedy-gonzales`)
3. Vercel auto-detects Next.js — no config needed
4. Set environment variables (copy from `.env.local`): `CONVEX_URL`, `OPENCLAW_*`, etc.
5. Deploy → every future push to `main` auto-deploys

## Checklist

- [ ] Connect GitHub repo to Vercel project
- [ ] Set all required env vars in Vercel dashboard
- [ ] Verify first auto-deploy works
- [ ] Add the Vercel deployment URL to the project settings in Speedy
- [ ] Document in `/docs/setup` — add a "Vercel auto-deploy" section so new users know to set this up

## Why this matters

Without auto-deploy, code changes pushed by the agent only appear after a manual `git pull + restart`. With Vercel connected, the full loop is automatic:

> Agent pushes code → GitHub → Vercel builds → live in ~2 min

## Files

- `src/app/[locale]/(public-routes)/docs/setup/page.tsx` (add Vercel section)
