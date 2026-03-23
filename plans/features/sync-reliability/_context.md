# Sync Reliability

**Status:** todo
**Priority:** high

## Overview

The sync engine has several reliability issues: a race condition in the sync guard (non-atomic read-check-set), `deleteProject` can hit Convex's 1000-operation limit on large projects, the cron syncs all projects every 15 minutes without cooldown, and `completedTicketCount` is patched even when unchanged.

Addresses audit findings #8, #10, #12, #27.

## Still needs

- [ ] Make sync guard atomic (check + set in one mutation)
- [ ] Batch or schedule `deleteProject` cascading deletes
- [ ] Add cooldown/needs-sync flag to cron sync
- [ ] Skip `completedTicketCount` patch when value unchanged
