# OTP Verification Dialog

**Status:** todo
**Priority:** medium

## What it does

A dialog that appears after the user submits their email. Shows 6 input slots for the OTP code with auto-focus navigation between digits.

## Checklist

- [x] Create `OtpDialog` component using shadcn Dialog + InputOTP
- [x] Implement 6-digit OTP input with auto-focus
- [x] Handle verification states: input → verifying → error
- [x] Add resend functionality with cooldown
- [x] Show specific error messages for invalid/expired codes

## Files

- `src/app/[locale]/(public-routes)/login/_components/OtpDialog.tsx`
- `src/app/[locale]/(public-routes)/login/_hooks/useOtpDialog.ts`
