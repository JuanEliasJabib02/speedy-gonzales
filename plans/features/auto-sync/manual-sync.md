# Manual Sync Button

**Status:** todo
**Priority:** medium

## What it does

A "Sync now" button in the project header that triggers the sync action manually. Fallback for when webhooks fail or for first-time setup.

## Checklist

- [x] Add "Sync now" button in ProjectHeader (UI)
- [x] Wire to `useAction(api.githubSync.syncProject)`
- [x] Show loading spinner while syncing (animate-spin on RefreshCw icon)
- [x] Disable button during sync to prevent double-trigger
- [ ] Show success/error toast after sync
