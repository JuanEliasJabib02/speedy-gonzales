# Auto-Ticket Rule

## When to create a ticket automatically

When Claude identifies an improvement, optimization, or incremental enhancement during development — **always persist it as a ticket**. Never let a recommendation exist only in conversation.

### Triggers

Create a ticket when you:
- Recommend a refactor, optimization, or architectural improvement
- Identify a missing feature or edge case during implementation
- Suggest streaming, caching, error handling, or UX improvements
- Notice tech debt or code that should be cleaned up
- Spot an opportunity to extract a reusable component or hook

### How

1. Use the `create-ticket` skill to create the `.md` file in the correct `plans/features/<epic>/` directory
2. If the improvement spans multiple features, put it in the most relevant epic
3. Set priority based on impact: `low` for nice-to-have, `medium` for should-do, `high` for important
4. Status is always `todo` for auto-created tickets

### Format

The ticket title should start with a verb: "Add streaming support", "Extract reusable hook", "Optimize query performance".

The description should explain:
- What the improvement is
- Why it matters
- Any relevant context from the current conversation

### What NOT to auto-ticket

- Bugs that should be fixed immediately (just fix them)
- Trivial changes that take less than 5 minutes (just do them)
- Speculative ideas without clear value
