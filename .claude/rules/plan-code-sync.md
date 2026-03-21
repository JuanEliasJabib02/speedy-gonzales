# Plan-Code Sync Rule

## The code is the source of truth

When creating or updating tickets, **always compare the plan with the actual code first**. The code is the truth — plans are documentation of intent and progress.

## Rules

### 1. Before creating a ticket
- Check if the feature described already exists in the codebase
- If it does → don't create a ticket for it, or create it as `completed`
- If it's partially done → create the ticket with only the missing parts in the checklist

### 2. Before updating a plan's `_context.md`
- Read the actual components, hooks, and routes in the codebase
- Compare `## What's built` with what really exists in the code
- Update checklist items to match reality: `[x]` for code that exists, `[ ]` for what's missing
- Update `## Still needs` to only list things that are actually missing

### 3. When finishing implementation work
- After implementing a feature or ticket, update the corresponding plan file
- Mark completed checklist items as `[x]`
- Update status (`todo` → `in-progress` → `completed`)
- Remove items from "Still needs" that are now built

### 4. Stale plan detection
- If a plan says something is `todo` but the code already implements it → fix the plan
- If a plan describes a component that no longer exists → remove it from the plan
- If env var names or architecture changed → update the plan to match

## When this applies
- Every time you use the `create-ticket` skill
- Every time you use the `create-feature` skill
- When the user asks to update plans
- When you finish implementing something and the plan needs updating
