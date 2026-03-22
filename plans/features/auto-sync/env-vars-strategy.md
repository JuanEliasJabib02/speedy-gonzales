# Env Vars Strategy (Local vs Cloud)

**Status:** completed
**Priority:** high

## The rule

Convex is always cloud. Only OPENCLAW_BASE_URL changes between environments.

## Local development (`.env.local`)

```bash
# Convex — same in both envs
NEXT_PUBLIC_CONVEX_URL=https://xxx.convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://xxx.convex.site

# GitHub sync
GITHUB_PAT=ghp_xxx

# OpenClaw — local or Turinng2 on LAN
OPENCLAW_BASE_URL=http://localhost:3001/v1
# or: OPENCLAW_BASE_URL=http://turinng2.local:3001/v1
OPENCLAW_API_KEY=<gateway-token>
OPENCLAW_MODEL=openclaw:main
```

## Production (Vercel dashboard env vars)

```bash
# Convex — same as local
NEXT_PUBLIC_CONVEX_URL=https://xxx.convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://xxx.convex.site

# GitHub sync
GITHUB_PAT=ghp_xxx

# OpenClaw — public URL of Turinng2
OPENCLAW_BASE_URL=https://turinng2.yourdomain.com/v1
OPENCLAW_API_KEY=<gateway-token>
OPENCLAW_MODEL=openclaw:main
```

## Checklist

- [ ] Confirm NEXT_PUBLIC_CONVEX_URL is set in `.env.local`
- [ ] Confirm NEXT_PUBLIC_CONVEX_SITE_URL is set in `.env.local`
- [ ] Confirm GITHUB_PAT is set in `.env.local`
- [ ] Set OPENCLAW_BASE_URL in `.env.local` (local OpenClaw URL)
- [ ] Add all vars to Vercel dashboard for production
- [ ] Set OPENCLAW_BASE_URL in Vercel to the public Turinng2 URL

## Notes

- Never commit `.env.local` to git
- `NEXT_PUBLIC_*` vars are exposed to the browser — only use for non-secret config
- `GITHUB_PAT` needs `repo` and optionally `admin:repo_hook` scope for webhook registration
