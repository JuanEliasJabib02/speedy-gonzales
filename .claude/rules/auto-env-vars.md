# Auto Environment Variables

## Rule

When Claude needs to set an environment variable during implementation (new API key, service URL, token, etc.), **do it automatically** using the `set-env-var` skill — don't ask for permission first.

### Behavior

1. Run `npx convex env set <VAR_NAME> "<value>"` immediately
2. If `.env.local` also needs it (for Next.js API routes), notify the user with the line to add:
   ```
   Added <VAR_NAME> to Convex. Also add to .env.local:
   <VAR_NAME>=<value>
   ```
3. If only Convex needs it, just notify:
   ```
   Added <VAR_NAME> to Convex.
   ```
4. Continue working — don't block on env var setup

### When this applies

- Integrating a new service (OpenClaw, Resend, GitHub, etc.)
- The user provides a URL/token/key in the conversation
- A feature requires a new configuration value

### When NOT to do this

- The user hasn't provided the actual value yet — ask for it first
- The variable contains highly sensitive production credentials — confirm before setting
- You're unsure which environment (Convex vs `.env.local` vs both) needs it — ask
