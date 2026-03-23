# Build Analytics Dashboard UI

**Status:** review
**Priority:** high
**Agent:** Perro salchicha 🌭

## What it does

New "Analytics" tab in the project view that visualizes agent performance, quality, and loop health using charts and stat cards. Filterable by time range.

## Checklist

- [x] Install `recharts` as dependency (`pnpm add recharts`)
- [x] Create new route: `src/app/[locale]/(app)/analytics/page.tsx` (TOP-LEVEL, not nested in project)
- [x] Add "Analytics" link in the main sidebar/navigation (same level as projects list)
- [x] **Top bar:** Project dropdown (All Projects default + each registered repo) + Time filter (This Week default | This Month | This Year)
- [x] **Stat cards row:**
  - Avg Resolution Time (formatted as "X min Y sec")
  - Quality Rate (% with green/yellow/red color based on threshold)
  - Success Rate (% completed vs blocked)
  - Total Tickets Processed
- [x] **Bar chart:** tickets per day/week — stacked bars with 3 colors: clean (green), with-fixes (amber), blocked (red)
- [x] **Line chart:** avg resolution time over time — shows if the agent is getting faster
- [x] **Loop Health section:**
  - Stat cards: total cycles, active vs idle, rate limit hits
  - Small bar chart: model usage (Opus vs Sonnet)
- [x] All data comes from the analytics queries (Ticket 4)
- [x] Loading skeletons while data loads
- [x] Empty state: "No analytics data yet. The loop will start collecting data on the next cycle."
- [x] Responsive: works on mobile (cards stack, charts resize)

## Files

- `src/app/[locale]/(app)/analytics/page.tsx` (NEW)
- `src/app/[locale]/(app)/analytics/_components/AnalyticsDashboard.tsx` (NEW)
- `src/app/[locale]/(app)/analytics/_components/StatCard.tsx` (NEW)
- `src/app/[locale]/(app)/analytics/_components/AnalyticsFilters.tsx` (NEW)
- `src/app/[locale]/(app)/analytics/_components/TicketsBarChart.tsx` (NEW)
- `src/app/[locale]/(app)/analytics/_components/ResolutionLineChart.tsx` (NEW)
- `src/app/[locale]/(app)/analytics/_components/LoopHealthSection.tsx` (NEW)
- `src/app/[locale]/(app)/analytics/_hooks/useAnalytics.ts` (NEW)
- `src/app/[locale]/(app)/analytics/_helpers/formatResolutionTime.ts` (NEW)
- `src/app/[locale]/(app)/_components/AppSidebar.tsx` (MODIFIED — added Analytics link)
- `convex/_generated/api.d.ts` (MODIFIED — added analytics + loopCycles types)
