import type { TicketStatus } from "../helpers"

/**
 * Pure function: given an array of active ticket statuses,
 * returns the derived epic status.
 */
export function deriveEpicStatus(statuses: TicketStatus[]): TicketStatus {
  if (statuses.length === 0) return "todo"

  // ALL tickets backlog → epic backlog
  const allBacklog = statuses.every((s) => s === "backlog")
  if (allBacklog) return "backlog"

  // ALL tickets backlog or todo → epic todo
  const allBacklogOrTodo = statuses.every((s) => s === "backlog" || s === "todo")
  if (allBacklogOrTodo) return "todo"

  // For mixed scenarios with backlog, filter out backlog tickets and calculate normally
  const nonBacklogStatuses = statuses.filter((s) => s !== "backlog")
  if (nonBacklogStatuses.length === 0) {
    // This shouldn't happen since we already handled all-backlog and all-backlog-or-todo
    return "todo"
  }

  // ALL completed or ALL completed+review → epic goes to "review" (NOT completed)
  // Only Juan manually moves epics to "completed" after reviewing
  const allCompletedOrReview = nonBacklogStatuses.every((s) => s === "completed" || s === "review")
  if (allCompletedOrReview) return "review"

  const hasInProgress = nonBacklogStatuses.some((s) => s === "in-progress")
  if (hasInProgress) return "in-progress"

  const hasBlocked = nonBacklogStatuses.some((s) => s === "blocked")
  const allTodo = nonBacklogStatuses.every((s) => s === "todo")

  if (hasBlocked && !hasInProgress) return "blocked"
  if (allTodo) return "todo"

  // Mixed statuses (e.g. todo + review, todo + completed) without in-progress
  // Treat as in-progress since work has started
  return "in-progress"
}

/**
 * Test helper — validates the engine against known scenarios.
 * Returns an array of failure messages (empty = all passed).
 */
export function testEpicStatusEngine(): string[] {
  const failures: string[] = []

  function assert(label: string, statuses: TicketStatus[], expected: TicketStatus) {
    const result = deriveEpicStatus(statuses)
    if (result !== expected) {
      failures.push(`${label}: expected "${expected}", got "${result}"`)
    }
  }

  assert("all completed", ["completed", "completed"], "review") // Juan moves to completed manually
  assert("all review", ["review", "review"], "review")
  assert("mix completed + review", ["completed", "review"], "review")
  assert("any in-progress", ["todo", "in-progress", "completed"], "in-progress")
  assert("blocked, none in-progress", ["todo", "blocked"], "blocked")
  assert("all todo", ["todo", "todo"], "todo")
  assert("empty array", [], "todo")
  assert("mixed todo + completed", ["todo", "completed"], "in-progress")
  assert("blocked + in-progress", ["blocked", "in-progress"], "in-progress")
  assert("single completed", ["completed"], "review") // Juan moves to completed manually
  assert("single todo", ["todo"], "todo")
  assert("single blocked", ["blocked"], "blocked")
  assert("single in-progress", ["in-progress"], "in-progress")
  assert("single review", ["review"], "review")

  // Backlog scenarios
  assert("all backlog", ["backlog", "backlog"], "backlog")
  assert("single backlog", ["backlog"], "backlog")
  assert("all backlog or todo", ["backlog", "todo", "backlog"], "todo")
  assert("backlog + todo only", ["backlog", "todo"], "todo")
  assert("backlog + completed", ["backlog", "completed"], "review") // ignore backlog, completed only -> review
  assert("backlog + review", ["backlog", "review"], "review") // ignore backlog, review only -> review
  assert("backlog + in-progress", ["backlog", "in-progress"], "in-progress") // ignore backlog, in-progress wins
  assert("backlog + blocked", ["backlog", "blocked"], "blocked") // ignore backlog, blocked only -> blocked
  assert("backlog + mixed", ["backlog", "todo", "completed"], "in-progress") // ignore backlog, mixed todo+completed -> in-progress

  return failures
}
