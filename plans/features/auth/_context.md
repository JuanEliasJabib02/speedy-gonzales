# Auth

**Status:** completed
**Priority:** critical

## Overview

Users can log in with Magic Link (email OTP). After login, they're redirected to the dashboard. All other pages are protected — unauthenticated users get sent to login.

## What's built

- Login page with email input
- 6-digit OTP dialog (sent via Resend)
- Middleware protects all `/(app)/` routes
- Convex Auth setup: `auth.ts`, `auth.config.ts`, `http.ts`
- Users table with auth-only fields (email, name, authProvider)

## Routes

- `/login` — public, login page
- `/dashboard` — protected, redirects to login if unauthenticated
- Authenticated users on `/login` get redirected to `/dashboard`
