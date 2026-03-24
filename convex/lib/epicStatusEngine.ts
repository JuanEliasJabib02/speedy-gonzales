import type { TicketStatus } from "../helpers"

/**
 * Pure function: given an array of active ticket statuses,
 * returns the derived epic status.
 */
export function deriveEpicStatus(statuses: TicketStatus[]): TicketStatus {
  if (statuses.length === 0) return "todo"

  const allCompleted = statuses.every((s) => s === "completed")
  if (allCompleted) return "completed"

  const allCompletedOrReview = statuses.every((s) => s === "completed" || s === "review")
  if (allCompletedOrReview) return "review"

  const hasInProgress = statuses.some((s) => s === "in-progress")
  if (hasInProgress) return "in-progress"

  const hasBlocked = statuses.some((s) => s === "blocked")
  const allTodo = statuses.every((s) => s === "todo")

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

  assert("all completed", ["completed", "completed"], "completed")
  assert("all review", ["review", "review"], "review")
  assert("mix completed + review", ["completed", "review"], "review")
  assert("any in-progress", ["todo", "in-progress", "completed"], "in-progress")
  assert("blocked, none in-progress", ["todo", "blocked"], "blocked")
  assert("all todo", ["todo", "todo"], "todo")
  assert("empty array", [], "todo")
  assert("mixed todo + completed", ["todo", "completed"], "in-progress")
  assert("blocked + in-progress", ["blocked", "in-progress"], "in-progress")
  assert("single completed", ["completed"], "completed")
  assert("single todo", ["todo"], "todo")
  assert("single blocked", ["blocked"], "blocked")
  assert("single in-progress", ["in-progress"], "in-progress")
  assert("single review", ["review"], "review")
  assert("backlog only", ["backlog"], "in-progress") // backlog is not todo/completed/review/blocked

  return failures
}
