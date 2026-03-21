# Manual Sync Button

**Status:** todo

## What it does

A "Sync now" button in the project header that triggers the sync action manually. Fallback for when webhooks fail or for first-time setup.

## Checklist

- [ ] Add "Sync now" button in ProjectHeader (already exists as UI)
- [ ] Wire to `useAction(api.github.syncRepo)`
- [ ] Show loading spinner while syncing
- [ ] Show success/error toast after sync
- [ ] Disable button during sync to prevent double-trigger
