# createProject Mutation

**Status:** todo

## What it does

Convex mutation that creates a new project for the authenticated user. Parses the repo URL to extract owner and repo name.

## Checklist

- [ ] Validate args: name (required), repoUrl (required), description (optional)
- [ ] Parse repoUrl to extract repoOwner and repoName
- [ ] Verify user is authenticated with `requireAuth()`
- [ ] Insert into projects table with defaults (plansPath: "plans/", branch: "main")
- [ ] Return the new project ID

## Validation

- Name must be non-empty
- Repo URL must match pattern: `github.com/{owner}/{repo}`
- One project per repo per user (check existing by_repo_owner_name)
