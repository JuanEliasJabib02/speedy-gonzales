# Convex Mutations Auth (SEC-01)

**Status:** review
**Priority:** critical

## What it does

Add `requireAuth` to all chat Convex mutations. Currently any anonymous request can inject or overwrite messages.

## Affected mutations in convex/chat.ts

- `saveAssistantMessage` — anyone can save fake agent messages
- `createStreamingMessage` — anyone can create streaming messages
- `finalizeStreamingMessage` — anyone can overwrite message content
- `markMessageInterrupted` — anyone can mark messages as interrupted

## Fix

Add `await requireAuth(ctx)` at the top of each handler.

For Next.js API route calls (server-side, no user session), use a Convex service token:
- Add `CONVEX_SERVICE_AUTH_TOKEN` env var
- In `route.ts`: `client.setAuth(process.env.CONVEX_SERVICE_AUTH_TOKEN!)`

## Checklist

- [x] Add `requireAuth(ctx)` to `saveAssistantMessage`
- [x] Add `requireAuth(ctx)` to `createStreamingMessage`
- [x] Add `requireAuth(ctx)` to `finalizeStreamingMessage`
- [x] Add `requireAuth(ctx)` to `markMessageInterrupted`
- [x] Authenticate ConvexHttpClient with user's session token in route.ts
- [ ] Test that chat still works after auth is added

## Files

- `convex/chat.ts`
- `src/app/api/chat/route.ts`
