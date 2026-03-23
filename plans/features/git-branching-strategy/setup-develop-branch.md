# Set Up Develop Branch and Update Workflow

**Status:** backlog
**Priority:** high
**Agent:** Charizard 🔥

## What it does

Create `develop` branch, update all automation to target develop, set up branch protection on main.

## Checklist

- [ ] Create `develop` branch from current `main`
- [ ] Push `develop` to origin
- [ ] Set `develop` as default branch on GitHub
- [ ] Update autonomous-loop skill: feature branches target `develop` not `main`
- [ ] Update Perro's dispatch prompts: base branch = `develop`
- [ ] Update Convex webhook to sync from `develop` (or both branches)
- [ ] Add branch protection on `main`: require PR, no direct push
- [ ] Add branch protection on `develop`: require PR from feature branches
- [ ] Update AGENTS.md rules to reflect new branching strategy
- [ ] Test: create a feature branch → PR to develop → merge → verify sync
