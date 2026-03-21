// Parses a plan .md file into structured data

type ParsedPlan = {
  title: string
  status: string
  priority: string
  body: string
  checklistTotal: number
  checklistCompleted: number
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

export function parsePlan(content: string): ParsedPlan {
  const title = parseTitle(content)
  const status = parseField(content, "Status") || "todo"
  const priority = parseField(content, "Priority") || "medium"
  const body = stripHeader(content)
  const checklist = parseChecklist(content)

  return {
    title,
    status,
    priority,
    body,
    checklistTotal: checklist.total,
    checklistCompleted: checklist.completed,
  }
}
