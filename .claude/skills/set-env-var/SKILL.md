---
name: set-env-var
description: Use when you need to add or update an environment variable. Sets it in Convex via `npx convex env set` and reminds the user to add it to `.env.local` if the Next.js server needs it too.
---

# Set Environment Variable

When this skill is triggered, set an environment variable in the project.

## Steps

1. Run `npx convex env list` to see current variables (avoid duplicates)
2. Set the variable in Convex:
   ```bash
   npx convex env set <VAR_NAME> "<value>"
   ```
3. Determine if Next.js also needs the variable:
   - If the variable is used in `src/app/api/` routes or Next.js server code → it also needs to be in `.env.local`
   - If the variable is only used in `convex/` functions → Convex is enough
4. If `.env.local` is also needed, notify the user:
   ```
   Added <VAR_NAME> to Convex. Also add it to .env.local:
   <VAR_NAME>=<value>
   ```
5. If only Convex is needed:
   ```
   Added <VAR_NAME> to Convex.
   ```

## Rules

- **Never log or echo secret values** in the output beyond the `npx convex env set` command itself
- If the variable already exists, ask the user before overwriting
- For public variables (prefixed with `NEXT_PUBLIC_`), these go in `.env.local` only — Convex doesn't need them
- Always verify the variable was set successfully (check the command output)
- Group related variables together (e.g., set both `SERVICE_URL` and `SERVICE_TOKEN` in one go)
