// Groups a flat file tree into epics based on directory structure
// Each directory under plansPath is an epic, containing _context.md + ticket .md files

import type { FileEntry } from "./gitProvider"

type EpicFiles = {
  context: FileEntry | null
  tickets: FileEntry[]
}

export function groupFilesIntoEpics(
  files: FileEntry[],
  plansPath: string,
): Map<string, EpicFiles> {
  const epics = new Map<string, EpicFiles>()

  // Normalize plansPath (remove trailing slash)
  const prefix = plansPath.replace(/\/$/, "")

  for (const file of files) {
    // Only process .md files under plansPath
    if (!file.path.startsWith(prefix) || !file.path.endsWith(".md")) continue

    // Get relative path after plansPath: e.g. "auth/_context.md" or "auth/magic-link.md"
    const relative = file.path.slice(prefix.length + 1)
    const parts = relative.split("/")

    // Must be exactly 2 levels deep: epicDir/file.md
    if (parts.length !== 2) continue

    const epicDir = `${prefix}/${parts[0]}`
    const fileName = parts[1]

    if (!epics.has(epicDir)) {
      epics.set(epicDir, { context: null, tickets: [] })
    }

    const epic = epics.get(epicDir)!
    if (fileName === "_context.md") {
      epic.context = file
    } else {
      epic.tickets.push(file)
    }
  }

  return epics
}
