type CommitRef = {
  hash: string
  message?: string
}

/**
 * Extracts commit references from agent response text.
 * Patterns matched:
 * - "commit abc1234: some message"
 * - GitHub commit URLs: https://github.com/owner/repo/commit/abc1234
 * - Bare SHA hashes (7-40 hex chars preceded by backtick or whitespace)
 */
export function parseCommitRefs(text: string): CommitRef[] {
  const refs: CommitRef[] = []
  const seen = new Set<string>()

  // Pattern 1: "commit <hash>: <message>" or "commit <hash> — <message>"
  const commitPattern = /commit\s+([a-f0-9]{7,40})[\s:—-]+(.+)/gi
  for (const match of text.matchAll(commitPattern)) {
    const hash = match[1]
    if (!seen.has(hash)) {
      seen.add(hash)
      refs.push({ hash, message: match[2].trim() })
    }
  }

  // Pattern 2: GitHub commit URLs
  const urlPattern = /github\.com\/[\w.-]+\/[\w.-]+\/commit\/([a-f0-9]{7,40})/gi
  for (const match of text.matchAll(urlPattern)) {
    const hash = match[1]
    if (!seen.has(hash)) {
      seen.add(hash)
      refs.push({ hash })
    }
  }

  // Pattern 3: Bare SHA in backticks like `abc1234`
  const backtickPattern = /`([a-f0-9]{7,40})`/g
  for (const match of text.matchAll(backtickPattern)) {
    const hash = match[1]
    // Only treat as commit hash if 7+ chars and not already captured
    if (!seen.has(hash) && hash.length >= 7) {
      seen.add(hash)
      refs.push({ hash })
    }
  }

  return refs
}
