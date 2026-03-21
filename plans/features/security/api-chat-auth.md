# API Chat Endpoint Auth (SEC-02)

**Status:** todo
**Priority:** critical

## What it does

The `/api/chat` POST endpoint has no auth check. Any anonymous request consumes AI API credits.

## Fix

Verify user session before processing the request. Use the existing auth setup (Convex Auth / NextAuth).

## Checklist

- [ ] Import auth helper in `route.ts`
- [ ] Check session at the top of the POST handler
- [ ] Return 401 if no valid session
- [ ] Pass user ID to Convex mutations for audit trail

## Files

- `src/app/api/chat/route.ts`
