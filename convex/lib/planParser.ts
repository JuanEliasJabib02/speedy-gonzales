/**
 * Helpers for parsing plan markdown content and generating paths/hashes.
 */

/** Count `- [ ]` and `- [x]` items in markdown content. */
export function parseChecklistCounts(content: string): {
  total: number
  completed: number
} {
  const unchecked = (content.match(/- \[ \]/g) ?? []).length
  const checked = (content.match(/- \[x\]/gi) ?? []).length
  return { total: unchecked + checked, completed: checked }
}

/** Simple DJB2 hash — deterministic, fast, no crypto dependency. */
export function generateContentHash(content: string): string {
  let hash = 5381
  for (let i = 0; i < content.length; i++) {
    hash = ((hash << 5) + hash + content.charCodeAt(i)) | 0
  }
  return (hash >>> 0).toString(16)
}

/** Convert a title to a URL-friendly slug. */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
