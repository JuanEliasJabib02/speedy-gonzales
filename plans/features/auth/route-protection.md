# Route Protection Middleware

**Status:** todo
**Priority:** medium

## What it does

Next.js middleware that protects all `/(app)/` routes. Unauthenticated users get redirected to login. Authenticated users on `/login` get redirected to dashboard.

## Checklist

- [x] Create middleware composing next-intl + convex-auth
- [x] Define private route patterns: `/dashboard`, `/projects`
- [x] Redirect unauthenticated users to `/{locale}/login`
- [x] Redirect authenticated users on login to `/{locale}/dashboard`
- [x] Support locale prefixes (en, es) in route matching

## Files

- `src/proxy.ts` — Middleware (auth + i18n composed)
