# Frontend Bug Fixes

**Status:** todo
**Priority:** medium

## Overview

Collection of frontend bugs found in the audit: event listener leak on drag unmount, NewTicketModal button does nothing, hardcoded branch prefix in useLivePlan, sessionStorage cache overflow in CommitDiffPanel, and missing abort controller in useCommitTimeline.

Addresses audit findings #13, #14, #15, #23, #29.

## Still needs

- [ ] Fix FeatureLayout drag handler listener leak
- [ ] Wire NewTicketModal onSubmit
- [ ] Make branch prefix configurable in useLivePlan
- [ ] Add size limit to CommitDiffPanel sessionStorage cache
- [ ] Add abort controller to useCommitTimeline
