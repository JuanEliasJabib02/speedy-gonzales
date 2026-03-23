# Remove Git Status Push-Back

**Status:** todo
**Priority:** high

## Overview

The `pushTicketStatusToGitHub` and `pushEpicStatusToGitHub` functions commit status changes back to the git repo via GitHub API. This is the old pattern — Convex is now the source of truth for ticket/epic status, and the loop no longer commits status to main.

These functions cause 403 errors (token lacks Contents permission) and are unnecessary. Remove them entirely.

## Still needs

- [ ] Remove git status push-back functions and all callers
