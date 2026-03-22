type TicketRef = {
  id: string
  title: string
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

function toKeywords(title: string): string[] {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2)
}

/**
 * Matches a commit message to tickets based on:
 * 1. Commit scope matching ticket slug (e.g. `feat(hide-chat-panel):` → "Hide Chat Panel")
 * 2. Commit message containing the ticket slug
 * 3. Keyword overlap (>= 2 significant words match)
 */
export function matchCommitToTickets(
  message: string,
  tickets: TicketRef[],
): TicketRef[] {
  const msg = message.toLowerCase()
  const matches: TicketRef[] = []

  for (const ticket of tickets) {
    const slug = slugify(ticket.title)
    const keywords = toKeywords(ticket.title)

    // Check if commit scope matches ticket slug
    const scopeMatch = msg.match(/^\w+\(([^)]+)\):/)
    if (scopeMatch) {
      const scope = scopeMatch[1].toLowerCase()
      if (slug.includes(scope) || scope.includes(slug)) {
        matches.push(ticket)
        continue
      }
    }

    // Check if message contains the slug
    if (slug.length > 3 && msg.includes(slug)) {
      matches.push(ticket)
      continue
    }

    // Keyword overlap (need at least 2 matching words of 3+ chars)
    const matchingWords = keywords.filter((w) => msg.includes(w))
    if (keywords.length >= 2 && matchingWords.length >= 2) {
      matches.push(ticket)
    }
  }

  return matches
}
