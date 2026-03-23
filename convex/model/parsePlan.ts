// Parses a plan .md file into structured data

const VALID_STATUSES = new Set(["backlog", "todo", "in-progress", "review", "completed", "blocked"])
const VALID_PRIORITIES = new Set(["low", "medium", "high", "critical"])

type ParsedPlan = {
  title: string
  status: string
  priority: string
  body: string
  checklistTotal: number
  checklistCompleted: number
  agentName?: string
  blockedReason?: string
}

export function parseTitle(content: string): string {
  const match = content.match(/^#\s+(.+)/m)
  if (!match) return "Untitled"
  return match[1].replace(/^Feature\s+\d+:\s*/i, "").trim()
}

export function parseField(content: string, field: string): string {
  // Use [^\n\r]+ to avoid capturing across newlines ([\w\s-]* was greedy and could include \n)
  const pattern = new RegExp(`\\*\\*${field}:\\*\\*\\s*([^\\n\\r]+)`, "i")
  const match = content.match(pattern)
  return match ? match[1].trim().toLowerCase() : ""
}

export function parseAgent(content: string): string | undefined {
  const pattern = /\*\*Agent:\*\*\s*([^\n\r]+)/i
  const match = content.match(pattern)
  return match ? match[1].trim() : undefined
}

export function parseChecklist(content: string): { completed: number; total: number } {
  const checked = (content.match(/- \[x\]/g) || []).length
  const unchecked = (content.match(/- \[ \]/g) || []).length
  return { completed: checked, total: checked + unchecked }
}

export function stripHeader(content: string): string {
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
    if (
      line.startsWith("**Status:**") ||
      line.startsWith("**Priority:**") ||
      line.startsWith("**Agent:**") ||
      line.startsWith("**Phase:**") ||
      line === ""
    ) {
      startIndex++
    } else {
      break
    }
  }

  return lines.slice(startIndex).join("\n").trim()
}

export function parseCommits(body: string): string[] {
  const match = body.match(/## Commits\s*\n([\s\S]*?)(?=\n## |\n*$)/)
  if (!match) return []
  const section = match[1]
  const hashes: string[] = []
  for (const line of section.split("\n")) {
    const hashMatch = line.match(/^-\s+`([a-f0-9]{7,40})`/)
    if (hashMatch) hashes.push(hashMatch[1])
  }
  return hashes
}

export function parseBlockedReason(content: string): string | undefined {
  const match = content.match(/## Blocked\s*\n([\s\S]*?)(?=\n## |\n*$)/)
  if (!match) return undefined
  const reason = match[1].trim()
  return reason || undefined
}

export function parsePlan(content: string): ParsedPlan {
  const title = parseTitle(content)
  const rawStatus = parseField(content, "Status")
  const status = VALID_STATUSES.has(rawStatus) ? rawStatus : "todo"
  const rawPriority = parseField(content, "Priority")
  const priority = VALID_PRIORITIES.has(rawPriority) ? rawPriority : "medium"
  const agentName = parseAgent(content)
  const body = stripHeader(content)
  const checklist = parseChecklist(content)
  const blockedReason = status === "blocked" ? parseBlockedReason(content) : undefined

  return {
    title,
    status,
    priority,
    body,
    checklistTotal: checklist.total,
    checklistCompleted: checklist.completed,
    agentName,
    blockedReason,
  }
}
