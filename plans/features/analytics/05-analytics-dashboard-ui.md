# Build Analytics Dashboard UI

**Status:** todo
**Priority:** high
**Agent:** Perro salchicha 🌭

## What it does

New "Analytics" tab in the project view that visualizes agent performance, quality, and loop health using charts and stat cards. Filterable by time range.

## Checklist

- [ ] Install `recharts` as dependency (`pnpm add recharts`)
- [ ] Create new route: `src/app/[locale]/(app)/analytics/page.tsx` (TOP-LEVEL, not nested in project)
- [ ] Add "Analytics" link in the main sidebar/navigation (same level as projects list)
- [ ] **Top bar:** Project dropdown (All Projects default + each registered repo) + Time filter (This Week default | This Month | This Year)
- [ ] **Stat cards row:**
  - Avg Resolution Time (formatted as "X min Y sec")
  - Quality Rate (% with green/yellow/red color based on threshold)
  - Success Rate (% completed vs blocked)
  - Total Tickets Processed
- [ ] **Bar chart:** tickets per day/week — stacked bars with 3 colors: clean (green), with-fixes (amber), blocked (red)
- [ ] **Line chart:** avg resolution time over time — shows if the agent is getting faster
- [ ] **Loop Health section:**
  - Stat cards: total cycles, active vs idle, rate limit hits
  - Small bar chart: model usage (Opus vs Sonnet)
- [ ] All data comes from the analytics queries (Ticket 4)
- [ ] Loading skeletons while data loads
- [ ] Empty state: "No analytics data yet. The loop will start collecting data on the next cycle."
- [ ] Responsive: works on mobile (cards stack, charts resize)

## Files

- `src/app/[locale]/(app)/analytics/page.tsx` (NEW)
- `src/app/[locale]/(app)/analytics/_components/AnalyticsDashboard.tsx` (NEW)
- `src/app/[locale]/(app)/analytics/_components/StatCard.tsx` (NEW)
- Main sidebar/navigation component (add Analytics link)
