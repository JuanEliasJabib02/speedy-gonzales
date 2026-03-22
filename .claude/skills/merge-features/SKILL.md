---
name: merge-features
description: Merge one or more epic directories into a target epic. Moves all tickets, rewrites _context.md, deletes absorbed directories, and sets up the chat message migration.
---

# Merge Features

When this skill is triggered, merge one or more source epic directories into a single target epic.

## Arguments

The user provides:
- **Source epics**: one or more epic slugs to absorb (e.g., `chat`, `plan-viewer`, `code-viewer`)
- **Target epic**: the slug that will absorb the others (e.g., `feature-view`)

## Steps

### 1. Verify no filename conflicts

```bash
# List all ticket filenames (excluding _context.md) across source + target
# Check for duplicates
```

If conflicts exist, report them and ask the user how to resolve (rename or skip).

### 2. Move ticket files

For each source epic, `git mv` every `.md` file **except `_context.md`** into `plans/features/<target>/`:

```bash
git mv plans/features/<source>/<ticket>.md plans/features/<target>/
```

### 3. Delete source directories

Remove the `_context.md` from each source epic (which empties the directory):

```bash
git rm plans/features/<source>/_context.md
```

Git automatically removes empty directories on commit.

### 4. Rewrite target `_context.md`

Read all source `_context.md` files before deleting them. Merge into the target's `_context.md`:

- **Overview**: combine descriptions, keep the target's as primary
- **What's built**: merge all `[x]` items, grouped by subsystem (layout, chat, viewer, etc.)
- **Still needs**: merge all `[ ]` items, deduplicate
- **Architecture decisions**: merge unique entries
- **Components / Hooks**: union of all listed
- **Depends on / Blocks**: union, remove self-references

Keep the target's existing status and priority unless the user overrides.

### 5. Add migration mutation (if chat messages exist)

If any source epic had a chat (check for `chatMessages` references or ask the user), add a temporary `migrateEpicMessages` internalMutation to `convex/githubSync.ts`:

```typescript
export const migrateEpicMessages = internalMutation({
  args: {
    oldEpicId: v.id("epics"),
    newEpicId: v.id("epics"),
  },
  handler: async (ctx, { oldEpicId, newEpicId }) => {
    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_epic", (q) => q.eq("epicId", oldEpicId))
      .collect()
    for (const msg of messages) {
      await ctx.db.patch(msg._id, { epicId: newEpicId })
    }
    console.log(
      `[migrate] Moved ${messages.length} messages from ${oldEpicId} to ${newEpicId}`
    )
  },
})
```

Tell the user to run it from the Convex dashboard after sync, then remove it.

### 6. Commit and push

```bash
git add plans/features/ convex/githubSync.ts
git commit -m "refactor(plans): merge <sources> into <target>"
git push
```

### 7. Post-merge checklist

Tell the user:
- [ ] Trigger a sync (or wait for webhook) so Convex picks up the changes
- [ ] Run `migrateEpicMessages` from the Convex dashboard with old/new epic IDs
- [ ] Verify tickets appear under the target epic in kanban
- [ ] Verify chat messages are preserved
- [ ] Remove the `migrateEpicMessages` mutation from `convex/githubSync.ts`

## Rules

- **Always read source `_context.md` files BEFORE deleting them** — you need their content to merge
- **Check for filename conflicts first** — two epics might have identically named tickets
- **Use `git mv`** not `mv` — preserves git history for blame/log
- **Single commit** for all file moves + context rewrite — keeps git history clean
- **Push immediately** so GitHub sync picks up the changes (per sync-safety rule)
- Write in English
