# Convex Auth Setup

**Status:** completed

## What it does

Configures Convex Auth with the Resend provider for email OTP authentication.

## Checklist

- [x] Install `@convex-dev/auth` and configure providers
- [x] Create `convex/auth.ts` with Magic Link provider
- [x] Create `convex/auth.config.ts` with provider domain config
- [x] Set up `convex/http.ts` for auth HTTP endpoints
- [x] Configure `AUTH_RESEND_KEY` environment variable

## Files

- `convex/auth.ts` — Auth config with providers + callbacks
- `convex/auth.config.ts` — Provider domain config
- `convex/http.ts` — HTTP endpoint for auth
