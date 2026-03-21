# GitHub OAuth Flow

**Status:** todo

## What it does

Allows users to connect their GitHub account. The OAuth token is used for all GitHub API calls (reading repos, creating webhooks, committing changes).

## Checklist

- [ ] Create GitHub OAuth app (or use existing)
- [ ] Implement OAuth redirect flow (settings page → GitHub → callback)
- [ ] Store access token in users table (encrypted)
- [ ] Add "Connect GitHub" button in settings
- [ ] Show connected status with GitHub username

## Scopes needed

- `repo` — read contents
- `admin:repo_hook` — create webhooks
- `read:user` — username
