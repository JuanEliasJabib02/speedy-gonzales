# Dependency Analysis + Queue Builder

**Status:** todo
**Priority:** high
**Agent:** Charizard 🔥

## What it does

Before dispatching tickets, Charizard analyzes which files each ticket is likely to touch and builds an execution queue that respects file-level conflicts.

## How it works

1. For each todo ticket, read:
   - The `## Files` section (explicit file list)
   - The `## What it does` section (infer from description)
   - The `## Checklist` items (often mention specific files/components)
2. Build a dependency map: `ticket → [file1, file2, ...]`
3. Group tickets that share files → these run SEQUENTIAL
4. Tickets with no file overlap → can run PARALLEL (up to `maxConcurrentPerFeature`)
5. Order by priority within each group

## Checklist

- [ ] Parse `## Files` section from ticket markdown — extract file paths
- [ ] Infer likely files from title/description when `## Files` is missing (best effort, can be approximate)
- [ ] Build dependency graph: map each ticket to its file set
- [ ] Detect conflicts: any shared file between two tickets = sequential constraint
- [ ] Build execution queue respecting constraints and priority ordering
- [ ] Return the queue as an ordered list with parallel groups marked

## Files

- `~/.openclaw/skills/autonomous-loop/SKILL.md`
