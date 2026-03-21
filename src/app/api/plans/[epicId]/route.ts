import { NextResponse } from "next/server"
import { readFile, readdir, stat } from "node:fs/promises"
import { join } from "node:path"

const PLANS_DIR = join(process.cwd(), "plans", "features")

function parseChecklist(content: string) {
  const checked = (content.match(/- \[x\]/g) || []).length
  const unchecked = (content.match(/- \[ \]/g) || []).length
  return { completed: checked, total: checked + unchecked }
}

function parseField(content: string, field: string): string {
  const pattern = new RegExp(`\\*\\*${field}:\\*\\*\\s*([\\w][\\w\\s-]*)`, "i")
  const match = content.match(pattern)
  return match ? match[1].trim().toLowerCase() : ""
}

function parseTitle(content: string): string {
  const match = content.match(/^#\s+(.+)/m)
  if (!match) return "Untitled"
  return match[1].replace(/^Feature\s+\d+:\s*/i, "").trim()
}

function stripHeader(content: string): string {
  const lines = content.split("\n")
  let startIndex = 0

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith("# ")) {
      startIndex = i + 1
      break
    }
  }

  while (startIndex < lines.length) {
    const line = lines[startIndex].trim()
    if (line.startsWith("**Status:**") || line.startsWith("**Priority:**") || line.startsWith("**Phase:**") || line === "") {
      startIndex++
    } else {
      break
    }
  }

  return lines.slice(startIndex).join("\n").trim()
}

type TicketData = {
  id: string
  title: string
  status: string
  content: string
  checklist: { completed: number; total: number }
}

// Map feature IDs from kanban (01-auth, etc.) to folder names (auth, etc.)
const ID_TO_FOLDER: Record<string, string> = {
  "01-auth": "auth",
  "02-projects": "projects",
  "03-dashboard": "dashboard",
  "04-github-sync": "github-sync",
  "05-kanban": "kanban",
  "06-feature-view": "feature-view",
  "07-plan-viewer": "plan-viewer",
  "08-chat": "chat",
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ epicId: string }> },
) {
  const { epicId } = await params
  const folderName = ID_TO_FOLDER[epicId] ?? epicId

  try {
    const featureDir = join(PLANS_DIR, folderName)
    const dirStat = await stat(featureDir).catch(() => null)

    if (!dirStat?.isDirectory()) {
      return NextResponse.json({ error: "Feature not found" }, { status: 404 })
    }

    // Read _context.md for the epic overview
    const contextPath = join(featureDir, "_context.md")
    const contextRaw = await readFile(contextPath, "utf-8").catch(() => "")
    const title = contextRaw ? parseTitle(contextRaw) : folderName
    const status = parseField(contextRaw, "Status") || "todo"
    const priority = parseField(contextRaw, "Priority") || "medium"
    const contextContent = contextRaw ? stripHeader(contextRaw) : ""
    const contextChecklist = parseChecklist(contextRaw)

    // Read all ticket files (everything except _context.md)
    const files = await readdir(featureDir)
    const ticketFiles = files
      .filter((f) => f.endsWith(".md") && f !== "_context.md")
      .sort()

    const tickets: TicketData[] = [
      {
        id: "_context",
        title: "Overview",
        status,
        content: contextContent,
        checklist: contextChecklist,
      },
    ]

    for (const file of ticketFiles) {
      const raw = await readFile(join(featureDir, file), "utf-8")
      const ticketTitle = parseTitle(raw)
      const ticketStatus = parseField(raw, "Status") || "todo"
      const ticketContent = stripHeader(raw)
      const ticketChecklist = parseChecklist(raw)

      tickets.push({
        id: file.replace(".md", ""),
        title: ticketTitle,
        status: ticketStatus,
        content: ticketContent,
        checklist: ticketChecklist,
      })
    }

    // Aggregate checklist across all tickets
    const totalChecklist = tickets.reduce(
      (acc, t) => ({
        completed: acc.completed + t.checklist.completed,
        total: acc.total + t.checklist.total,
      }),
      { completed: 0, total: 0 },
    )

    return NextResponse.json({
      title,
      status,
      priority,
      checklist: totalChecklist,
      content: contextContent,
      tickets,
    })
  } catch {
    return NextResponse.json({ error: "Failed to read plans" }, { status: 500 })
  }
}
