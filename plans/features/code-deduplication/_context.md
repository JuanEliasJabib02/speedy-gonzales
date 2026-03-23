# Code Deduplication

**Status:** todo
**Priority:** medium

## Overview

Several pieces of logic are duplicated across the codebase: `parsePlan` exists in both Convex and a legacy API route, `pushTicketStatusToGitHub` and `pushEpicStatusToGitHub` are 90% identical, and status/priority styling maps are defined independently in 4 components.

Addresses audit findings #20, #21, #28.

## Still needs

- [ ] Extract shared `pushStatusToGitHub` helper
- [ ] Extract shared status/priority styling constants
- [ ] Remove duplicate `parsePlan` (will be handled by dead-code-cleanup deleting the legacy route)
