# Unify pushStatusToGitHub Functions

**Status:** in-progress
**Priority:** medium
**Agent:** Perro salchicha 🌭

## What it does

`pushTicketStatusToGitHub` and `pushEpicStatusToGitHub` in `githubSync.ts` are ~80 lines of nearly identical code. Both fetch a file from GitHub, decode base64, replace the `**Status:**` line, re-encode, and commit. Extract a shared helper.

## Checklist

- [ ] Create `pushStatusToGitHub(ctx, { projectId, filePath, newStatus, commitMessage })` helper
- [ ] Refactor `pushTicketStatusToGitHub` to use the shared helper
- [ ] Refactor `pushEpicStatusToGitHub` to use the shared helper
- [ ] Replace deprecated `btoa(unescape(encodeURIComponent(...)))` with `TextEncoder` + proper base64 encoding
- [ ] Replace deprecated `atob` decoding with `TextDecoder` approach

## Files

- `convex/githubSync.ts`
