# Auth

**Status:** completed
**Priority:** critical

## Overview

Users can log in with Magic Link (email OTP). After login, they're redirected to the dashboard. All other pages are protected — unauthenticated users get sent to login.

## What's built

- Login page with email input (MagicLink component)
- 6-digit OTP dialog (sent via Resend)
- Middleware protects all `/(app)/` routes
- Convex Auth setup: `auth.ts`, `auth.config.ts`, `http.ts`
- Users table with auth-only fields (email, name, authProvider)
- App Shell: sidebar with Zap branding, nav items (Projects, Settings placeholder), UserMenu with ThemeToggle and sign out
- Sidebar hides when on `/features/` routes (full-width for feature view)

## App Shell Components

- `AppSidebar` — 240px sidebar with Zap logo, nav items, user menu
- `SidebarNavItem` — individual nav link with icon + label + active state
- `UserMenu` — user initial avatar, email, ThemeToggle, sign out button
- `ThemeToggle` — light/dark mode toggle (shared component in `src/lib/components/common/`)

## Routes

- `/login` — public, login page
- `/dashboard` — protected, redirects to login if unauthenticated
- Authenticated users on `/login` get redirected to `/dashboard`
