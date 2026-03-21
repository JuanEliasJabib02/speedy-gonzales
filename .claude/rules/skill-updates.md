# Skill Updates Rule

## When a skill or rule is modified

Any time you update a file in `.claude/skills/` or `.claude/rules/`, you must commit and push immediately.

### Steps

1. Make the edit
2. `git add` only the changed skill/rule file(s)
3. Commit with `📝 docs(skill):` or `📝 docs(rule):` prefix
4. `git push`

### Safety

- Never batch skill/rule changes with code changes — commit them separately
- Review the diff before committing to avoid accidentally including unrelated files
- If multiple skills are updated in one session, they can share a single commit
