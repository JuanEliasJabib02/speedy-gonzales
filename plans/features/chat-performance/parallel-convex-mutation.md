# Parallel Convex Mutation

**Status:** todo
**Priority:** high

## What it does

Currently `route.ts` calls `createStreamingMessage` BEFORE starting the stream to OpenClaw. This adds 500ms-1s of dead time where the user sees nothing. Move the Convex mutation to run in parallel with the API call so streaming starts faster.

## Checklist

- [ ] Fire `createStreamingMessage` and the OpenClaw fetch in parallel (Promise.all or fire-and-forget)
- [ ] Buffer the first few chunks if the mutation hasn't resolved yet
- [ ] Start sending chunks to the client immediately without waiting for Convex messageId
- [ ] Pass the messageId to `finalizeStreamingMessage` once available
- [ ] Test that message saving still works correctly with the parallel approach
