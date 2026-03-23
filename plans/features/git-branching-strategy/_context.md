# Git Branching Strategy — Main + Develop

**Status:** backlog
**Priority:** high

## Overview

Transition from the current workflow (features → main) to a proper branching strategy:

- `main` — production, stable releases only
- `develop` — integration branch, all features merge here first
- `feat/*` branches → PR to `develop`
- `develop` → PR to `main` for releases

This protects main from broken features and gives a staging area for testing.

## Still needs

- [ ] Create develop branch from current main
- [ ] Update loop/skill to target develop instead of main
- [ ] Set up branch protection rules on GitHub
