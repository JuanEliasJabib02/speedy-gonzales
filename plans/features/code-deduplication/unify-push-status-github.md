# Unify pushStatusToGitHub Functions

**Status:** review
**Priority:** medium
**Agent:** Perro salchicha 🌭

## What it does

`pushTicketStatusToGitHub` and `pushEpicStatusToGitHub` in `githubSync.ts` are ~80 lines of nearly identical code. Both fetch a file from GitHub, decode base64, replace the `**Status:**` line, re-encode, and commit. Extract a shared helper.

## Checklist

- [x] Create `pushStatusToGitHub(ctx, { projectId, filePath, newStatus, commitMessage })` helper
- [x] Refactor `pushTicketStatusToGitHub` to use the shared helper
- [x] Refactor `pushEpicStatusToGitHub` to use the shared helper
- [x] Replace deprecated `btoa(unescape(encodeURIComponent(...)))` with `TextEncoder` + proper base64 encoding
- [x] Replace deprecated `atob` decoding with `TextDecoder` approach

## Files

- `convex/githubSync.ts`

## Commits
- `c2c1329873da490f04afe28ef78d0259d88b1104`
