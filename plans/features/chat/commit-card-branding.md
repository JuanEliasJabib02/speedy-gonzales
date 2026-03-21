# Commit Card — Git Provider Branding

**Status:** todo
**Priority:** low

## What it does

The commit card shown in chat messages currently uses a generic `GitCommitHorizontal` icon. Improve it with proper branding per git provider: GitHub's octocat logo for GitHub commits, Bitbucket's logo when Bitbucket support is added later.

## Checklist

### GitHub branding (now)
- [ ] Replace `GitCommitHorizontal` icon with the GitHub logo SVG (or an img/icon component)
- [ ] Show a subtle "GitHub" label or use the logo as the card accent color (#24292f / #0d1117)
- [ ] The card should feel like a GitHub-native element — dark, clean, with the GH mark

### Bitbucket branding (future — when Bitbucket integration is added)
- [ ] Detect provider from commit URL (`github.com` vs `bitbucket.org`)
- [ ] Render Bitbucket logo + blue accent (#0052CC) for Bitbucket commits
- [ ] Same card layout, different branding

### Provider detection
- [ ] Parse commit URL to detect provider: `github.com` → GitHub, `bitbucket.org` → Bitbucket
- [ ] Create a `getProviderFromUrl(url)` util that returns `"github" | "bitbucket" | "unknown"`

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/ChatMessage.tsx`
- `src/lib/utils/getProviderFromUrl.ts` (new)
- `src/lib/components/icons/GitHubLogo.tsx` (new SVG component)
- `src/lib/components/icons/BitbucketLogo.tsx` (new, for when Bitbucket lands)
