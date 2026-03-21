# Fix Webhook URL (GitHub → Convex)

**Status:** todo
**Priority:** critical

## What it does

The GitHub webhook must point to the Convex HTTP endpoint, NOT to localhost or ngrok.
This is the root cause of auto-sync breaking when moving to cloud.

## The correct webhook URL

```
https://<your-deployment>.convex.site/github-webhook
```

This URL is always public and available regardless of where Next.js runs.

## Steps

- [ ] Go to your GitHub repo → Settings → Webhooks
- [ ] Find the broken webhook (pointing to localhost or old ngrok URL)
- [ ] Update the URL to: `https://<your-deployment>.convex.site/github-webhook`
- [ ] Set Content type: `application/json`
- [ ] Select event: `Just the push event`
- [ ] Save and test with a push

## Where to find your Convex site URL

Look in your `.env.local`:
```
NEXT_PUBLIC_CONVEX_URL=https://xxx.convex.cloud
```
Replace `.convex.cloud` with `.convex.site` → that's the webhook URL.

Or check Convex dashboard → your deployment → Settings → URL.

## Why this works

Convex is always cloud — it doesn't matter if Speedy runs locally or on Vercel.
The webhook always fires to Convex directly, which then runs the sync internally.
