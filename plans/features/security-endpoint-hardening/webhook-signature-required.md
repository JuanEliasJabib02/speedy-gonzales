# Require Webhook Signature Verification

**Status:** todo
**Priority:** high
**Agent:** Perro salchicha 🌭

## What it does

The GitHub webhook handler currently skips HMAC signature verification when `webhookSecret` is not set on the project. This means anyone who knows the repo owner/name can trigger syncs. Fix: always require signature verification — reject requests if the project has no webhook secret configured.

## Checklist

- [ ] In `convex/http.ts` webhook handler: if `project.webhookSecret` is falsy, return 403 with "Webhook secret not configured"
- [ ] Keep existing HMAC verification logic for projects that have a secret
- [ ] Add CORS headers (`Access-Control-Allow-Origin`, etc.) to all custom HTTP routes
- [ ] Test: webhook request without valid signature → rejected

## Files

- `convex/http.ts`
