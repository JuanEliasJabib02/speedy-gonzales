![speedy gonzales](https://github.com/user-attachments/assets/eb8651eb-614c-4e83-9c3b-fd48c4bbeef4)

# Speedy Gonzales

A web command center for managing software projects where AI agents do the development work.

## Tech stack

- **Frontend:** Next.js 16 + React 19 + Tailwind CSS v4 + shadcn/ui
- **Backend:** Convex (DB, functions, auth)
- **Auth:** Google OAuth + Magic Link (email OTP) via Convex Auth
- **Email:** Resend
- **i18n:** next-intl (en/es/pt)

## Getting started

1. Clone the repo and install dependencies:

```bash
pnpm install
```

2. Set up your Convex project:

```bash
npx convex dev
```

3. Add environment variables to your Convex dashboard:
   - `AUTH_RESEND_KEY` — Resend API key for sending OTP emails
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google OAuth credentials

4. Run the dev server:

```bash
pnpm dev
```

## Project structure

```
src/app/[locale]/(public-routes)/login/   # Login page (Google + Magic Link)
src/app/[locale]/(app)/dashboard/         # Protected dashboard (placeholder)
src/lib/                                  # Shared components, hooks, helpers
convex/                                   # Backend schema, auth, queries
messages/                                 # i18n translations (en/es)
plans/                                    # Product plans, design system, feature specs
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Next.js + Convex dev servers |
| `pnpm build` | Production build |
| `pnpm lint` | Lint with Biome |
| `pnpm lint:fix` | Auto-fix lint issues |
