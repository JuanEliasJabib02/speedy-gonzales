# Magic Link Sign-in

**Status:** todo
**Priority:** medium

## What it does

Email-based authentication flow. User enters email, receives a 6-digit OTP code via Resend, enters it to sign in.

## Checklist

- [x] Create `MagicLink` component with email input + send button
- [x] Wire to `useAuthActions().signIn` with "resend-otp" provider
- [x] Handle loading state while sending email
- [x] Show error state for invalid emails
- [x] Redirect to dashboard after successful sign-in

## Files

- `src/app/[locale]/(public-routes)/login/_components/MagicLink.tsx`
- `src/app/[locale]/(public-routes)/login/_hooks/useLoginForm.ts`
