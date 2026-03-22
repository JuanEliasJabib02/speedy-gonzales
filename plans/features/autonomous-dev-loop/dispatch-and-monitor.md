# Dispatch + Monitor + Crash Recovery

**Status:** todo
**Priority:** high
**Agent:** Charizard 🔥

## What it does

The core execution engine. Takes the ticket queue from the dependency analysis, dispatches Perro salchicha for each ticket, monitors progress, and handles crashes.

## Dispatch flow per ticket

1. Move ticket to `in-progress` in the .md file → commit → push
2. Spawn Perro salchicha (Claude Code) with the ticket context:
   - Working directory: project's `localPath`
   - Prompt: ticket plan + project rules (.claude/claude.md)
   - On success: update ticket to `review`, commit, push
   - On failure: `git revert` + mark `blocked` with reason
3. Monitor the subagent session — poll every 60s
4. On crash: relaunch up to 3 times, then mark `blocked`
5. Trigger Convex sync after each push

## Checklist

- [ ] Move ticket to in-progress before dispatch (edit .md → commit → push)
- [ ] Build Perro's prompt: include ticket plan, project conventions, git identity
- [ ] Spawn Claude Code via `exec` with `--permission-mode bypassPermissions --print`
- [ ] Monitor with `process(action=poll)` — detect completion or crash
- [ ] On success: verify ticket moved to review, trigger Convex sync
- [ ] On failure: verify git revert happened, mark blocked, trigger sync
- [ ] Crash recovery: relaunch up to 3 times, then block with "Perro crashed 3 times"
- [ ] Respect `maxConcurrentPerFeature` and `maxConcurrentGlobal` limits
- [ ] Notify Slack on each ticket completion or block

## Files

- `~/.openclaw/skills/autonomous-loop/SKILL.md`
