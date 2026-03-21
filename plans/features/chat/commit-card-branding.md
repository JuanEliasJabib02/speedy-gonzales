# Commit Card — Git Provider Branding

**Status:** completed
**Priority:** low

## What it does

The commit card shown in chat messages currently uses a generic `GitCommitHorizontal` icon. Improve it with proper branding per git provider: GitHub's octocat logo for GitHub commits, Bitbucket's logo when Bitbucket support is added later.

## Checklist

### GitHub branding (now)
- [x] Replace `GitCommitHorizontal` icon with the GitHub logo SVG (or an img/icon component)
- [x] Show a subtle "GitHub" label or use the logo as the card accent color (#24292f / #0d1117)
- [x] The card should feel like a GitHub-native element — dark, clean, with the GH mark

### Bitbucket branding (future — when Bitbucket integration is added)
- [ ] Detect provider from commit URL (`github.com` vs `bitbucket.org`)
- [ ] Render Bitbucket logo + blue accent (#0052CC) for Bitbucket commits
- [ ] Same card layout, different branding

### Provider detection
- [x] Parse commit URL to detect provider: `github.com` → GitHub, `bitbucket.org` → Bitbucket
- [x] Create a `getProviderFromUrl(url)` util that returns `"github" | "bitbucket" | "unknown"`

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/ChatMessage.tsx` (all changes inline — `getProviderFromUrl`, `GitHubLogo`, updated `CommitCard`)

