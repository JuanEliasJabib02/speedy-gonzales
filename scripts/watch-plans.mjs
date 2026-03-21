/**
 * watch-plans.mjs
 *
 * Local file watcher for plans/ directory.
 * When files change, triggers a sync to Convex directly.
 *
 * Usage: node scripts/watch-plans.mjs
 * Or via pnpm dev (runs in parallel with next dev and convex dev)
 *
 * Env vars needed (same as .env.local):
 *   NEXT_PUBLIC_CONVEX_URL — your Convex cloud URL
 *   CONVEX_DEPLOY_KEY      — Convex deploy key (for server-side mutation calls)
 *   GITHUB_PAT             — GitHub token (Convex uses this to fetch files)
 */

import { watch } from "fs"
import { resolve, join } from "path"
import { existsSync, readFileSync } from "fs"

// Load .env.local manually (no dotenv dependency needed in Node 20+)
function loadEnv() {
  const envPath = join(process.cwd(), ".env.local")
  if (!existsSync(envPath)) return {}

  const env = {}
  const content = readFileSync(envPath, "utf8")
  for (const line of content.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eqIdx = trimmed.indexOf("=")
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "")
    env[key] = value
  }
  return env
}

const env = loadEnv()
const CONVEX_SITE_URL = env.NEXT_PUBLIC_CONVEX_SITE_URL || process.env.NEXT_PUBLIC_CONVEX_SITE_URL
const PLANS_DIR = resolve(process.cwd(), "plans")

if (!CONVEX_SITE_URL) {
  console.error("[watch-plans] ❌ Missing NEXT_PUBLIC_CONVEX_SITE_URL in .env.local")
  console.error("[watch-plans] Add: NEXT_PUBLIC_CONVEX_SITE_URL=https://necessary-fish-66.convex.site")
  process.exit(1)
}

// Debounce: avoid firing multiple syncs on rapid saves
let debounceTimer = null
let isSyncing = false

async function triggerSync() {
  if (isSyncing) {
    console.log("[watch-plans] ⏳ Already syncing, skipping...")
    return
  }

  isSyncing = true
  console.log("[watch-plans] 🔄 Plans changed — triggering sync...")

  try {
    const res = await fetch(`${CONVEX_SITE_URL}/github-webhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-github-event": "push",
        // No signature needed if webhookSecret is not set in Convex
      },
      body: JSON.stringify({
        repository: {
          owner: { login: "JuanEliasJabib02" },
          name: "speedy-gonzales",
        },
        commits: [
          {
            // Fake a change to plans/ so the webhook triggers sync
            modified: ["plans/features/chat/_context.md"],
          },
        ],
      }),
    })

    const text = await res.text()
    if (res.ok) {
      console.log("[watch-plans] ✅ Sync triggered:", text)
    } else {
      console.error("[watch-plans] ❌ Sync failed:", res.status, text)
    }
  } catch (err) {
    console.error("[watch-plans] ❌ Error triggering sync:", err.message)
  } finally {
    isSyncing = false
  }
}

function scheduleSync() {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(triggerSync, 1500) // 1.5s debounce
}

// Watch the plans/ directory recursively
if (!existsSync(PLANS_DIR)) {
  console.error(`[watch-plans] ❌ plans/ directory not found at: ${PLANS_DIR}`)
  process.exit(1)
}

console.log(`[watch-plans] 👀 Watching: ${PLANS_DIR}`)
console.log(`[watch-plans] 🌐 Convex site: ${CONVEX_SITE_URL}`)
console.log(`[watch-plans] 💡 Edit any file in plans/ and Convex will auto-sync`)

watch(PLANS_DIR, { recursive: true }, (eventType, filename) => {
  if (!filename) return
  if (!filename.endsWith(".md")) return
  if (filename.includes(".git")) return

  console.log(`[watch-plans] 📝 Changed: ${filename}`)
  scheduleSync()
})
