# Feature 1: Auth

**Status:** DONE
**Phase:** 0 (already built)

## What it does

Users can log in with Google OAuth or Magic Link (email OTP). After login, they're redirected to the dashboard. All other pages are protected — unauthenticated users get sent to login.

## What's built

- Login page with Google button + email input
- 6-digit OTP dialog (sent via Resend)
- Account linking (same email via Google and Magic Link = same user)
- Middleware protects all `/(app)/` routes
- Convex Auth setup: `auth.ts`, `auth.config.ts`, `http.ts`
- Users table with auth-only fields (email, name, authProvider)

## Routes

- `/login` — public, login page
- `/dashboard` — protected, redirects to login if unauthenticated
- Authenticated users on `/login` get redirected to `/dashboard`

## Files

```
convex/auth.ts                           # Auth config with providers + callbacks
convex/auth.config.ts                    # Provider domain config
convex/schema/users.ts                   # Users table (email, name, authProvider)
convex/users.ts                          # getCurrentUser query
src/proxy.ts                             # Middleware (auth + i18n)
src/app/[locale]/(public-routes)/login/  # Login page + components + hooks
src/app/[locale]/(app)/dashboard/        # Protected placeholder page
```

## Nothing left to do

This feature is complete. The dashboard page is a placeholder that will be replaced by Feature 3 (Dashboard).
