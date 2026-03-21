---
name: commit
description: Use when the user wants to create a git commit. Stages changes, picks the right commit type, and writes the message following the project's commitizen convention.
---

# Commit — Commitizen Convention

When this skill is triggered, create a git commit following the project's emoji prefix convention.

## Commit types

| Prefix | When to use |
|--------|-------------|
| `✨ feat` | New feature |
| `🐛 fix` | Bug fix |
| `📝 docs` | Documentation only |
| `🎨 style` | Formatting, no logic change |
| `♻️ refactor` | Refactor — no bug fix, no new feature |
| `⚡️ perf` | Performance improvement |
| `✅ test` | Adding or fixing tests |
| `⬆️ build` | Build system or dependency changes |
| `👷 ci` | CI configuration changes |
| `🔧 chore` | Other changes not touching src |
| `⏪️ revert` | Reverts a previous commit |

## Steps

1. Run `git status` and `git diff` to understand what changed
2. **Clean the files before staging:**
   - Remove all `console.log` statements from every modified file
   - Remove inline comments that explain obvious code (`// increment i`, `// return the value`, etc.)
   - Keep: `TODO`, `FIXME`, `PERF`, `REFACTOR` tagged comments (project convention) and any comment the user clearly wrote as documentation
3. Pick the correct prefix from the table above
4. Stage the relevant files (specific paths, never `git add .` blindly)
5. Write the commit message:
   - Format: `<emoji> <type>(<scope>): <short description>`
   - Scope is optional but use it when the change is feature-specific (e.g. `reset`, `booking`, `auth`)
   - Description: imperative, lowercase, no period
   - Example: `♻️ refactor(booking): split useResetBooking into focused sub-hooks`
6. Always commit using `git commit --no-verify`

## Message format

```
<emoji> <type>(<scope>): <short description>

<body — general description of what was worked on in this commit.
Describe the feature/fix as a whole so anyone reading the log can
quickly understand the scope. Group related changes under short
headings when the commit touches multiple areas.>

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

### Body guidelines
- **Always include a body** — the subject line is the "what", the body is the "context"
- Write it as a brief summary a developer can scan in 10 seconds
- **Be human and descriptive** — write what you actually did, not just what files changed. Example: "Changed the text color of agent messages from gray to white so they're easier to read on dark backgrounds" beats "Updated ChatMessage.tsx". Describe the visible change or behavior, not the code.
- Group by area if the commit touches multiple things (e.g. "Public docs:", "Sync fixes:")
- Use plain sentences, not bullet-per-file — describe the work, not the diff
- Keep it under ~10 lines

### Example

```
✨ feat: add public docs wiki + fix GitHub Sync race condition

Public documentation pages at /docs explaining how Speedy Gonzales works:
- Landing page with hero and section cards
- /docs/sync — how GitHub Sync works (webhook, manual, plan structure)
- /docs/chat — how OpenClaw Chat works (Charizard agent, persistence)
- All Server Components, no auth required, pre-rendered at build time

GitHub Sync bugfixes in convex/githubSync.ts:
- Race condition: skip sync if another is already running
- Ticket moves: always update epicId even when content hash is unchanged
- Epic counts: always update ticketCount and sortOrder on every sync

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

## Rules
- Never use `git add .` or `git add -A`
- Always use `--no-verify` — commitlint hooks require a ticket format not used here
- If nothing is staged, say so and ask what to include
