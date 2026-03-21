# Design System — Speedy Gonzales

**Philosophy:** Monochromatic, minimal, dark-first. The UI stays out of the way — content and status are the stars. Think Linear meets Notion for dev tools.

**One rule:** Zero chromatic colors except status indicators and the single blue accent. Everything else is gray.

---

## Color palette

### Dark theme (default)

| Token | HSL | Usage |
|-------|-----|-------|
| `--background` | `0 0% 7%` | Page background — near-black |
| `--foreground` | `0 0% 95%` | Primary text |
| `--card` | `0 0% 9%` | Card/panel surfaces |
| `--card-foreground` | `0 0% 95%` | Text on cards |
| `--popover` | `0 0% 11%` | Dropdowns, tooltips, modals |
| `--popover-foreground` | `0 0% 95%` | Text in popovers |
| `--primary` | `220 80% 60%` | Blue accent — buttons, links, focus rings |
| `--primary-foreground` | `0 0% 100%` | Text on primary buttons |
| `--secondary` | `0 0% 14%` | Subtle surface (secondary buttons, tags) |
| `--secondary-foreground` | `0 0% 85%` | Text on secondary surfaces |
| `--muted` | `0 0% 12%` | De-emphasized backgrounds |
| `--muted-foreground` | `0 0% 55%` | Placeholder text, captions, timestamps |
| `--accent` | `0 0% 14%` | Hover/selected state backgrounds |
| `--accent-foreground` | `0 0% 95%` | Text on accent backgrounds |
| `--destructive` | `0 70% 55%` | Delete, errors |
| `--success` | `145 60% 42%` | Completed, success states |
| `--border` | `0 0% 16%` | All borders — subtle, low contrast |
| `--input` | `0 0% 14%` | Input field backgrounds |
| `--ring` | `220 80% 60%` | Focus rings (matches primary) |

### Light theme

Same structure, inverted. Backgrounds become white/near-white, text becomes dark. Primary shifts slightly to `220 80% 50%` for better contrast on light surfaces.

### Status colors — the ONLY chromatic UI elements

| Status | Token | Dark HSL | What it means |
|--------|-------|----------|---------------|
| Todo | `--status-todo` | `0 0% 45%` | Gray — hasn't started |
| In Progress | `--status-in-progress` | `220 80% 60%` | Blue — actively being worked |
| Review | `--status-review` | `270 60% 60%` | Purple — needs human review |
| Blocked | `--status-blocked` | `0 70% 55%` | Red — stuck, needs attention |
| Completed | `--status-completed` | `145 60% 42%` | Green — done |

**Usage:** Status pills, kanban column headers, sidebar dot indicators, progress bars.

---

## Surface hierarchy

The UI uses a clear layering system. Each surface is slightly lighter than its parent:

```
Background (7%)  →  Card (9%)  →  Popover (11%)  →  Secondary (14%)
```

This creates depth without shadows. Borders at `16%` provide subtle separation.

**Rule:** Never stack more than 3 surface levels. If you need more depth, you're overcomplicating the layout.

---

## Typography

**Font:** Poppins (loaded globally via `next/font`). Never override `font-family`.

| Role | Tailwind class | Weight | Size |
|------|---------------|--------|------|
| Page title | `text-2xl font-semibold` | 600 | 1.5rem |
| Section heading | `text-lg font-medium` | 500 | 1.125rem |
| Card title | `text-base font-medium` | 500 | 1rem |
| Body text | `text-sm` | 400 | 0.875rem |
| Caption / meta | `text-xs text-muted-foreground` | 400 | 0.75rem |
| Code / paths | `text-sm font-mono` | 400 | 0.875rem |

**Rules:**
- Max two font weights per screen (medium + regular, or semibold + regular)
- Use `text-muted-foreground` for secondary information, never reduce opacity
- Headings use `text-foreground`, no special heading color

---

## Spacing

Tailwind utility classes only. Never use arbitrary values like `p-[13px]`.

| Context | Value | Tailwind |
|---------|-------|----------|
| Page padding | 24px | `p-6` |
| Card padding | 16px–20px | `p-4` or `p-5` |
| Gap between cards | 16px | `gap-4` |
| Gap inside card sections | 12px | `gap-3` |
| Inline spacing (icon + text) | 8px | `gap-2` |
| Tight list items | 4px–8px | `gap-1` or `gap-2` |

**Rule:** Use `gap-*` on flex/grid containers instead of margin on children. Keeps spacing consistent and composable.

---

## Border radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius` | `0.625rem` (10px) | Base radius |
| `rounded-lg` | `var(--radius)` | Cards, modals, large containers |
| `rounded-md` | `calc(var(--radius) - 2px)` | Buttons, inputs |
| `rounded-sm` | `calc(var(--radius) - 4px)` | Tags, badges, small elements |

---

## Icons

Use `lucide-react` (bundled with shadcn/ui). Consistent sizes:

| Context | Size | Tailwind |
|---------|------|----------|
| Inline with text | 16px | `size-4` |
| Button icon | 16px | `size-4` |
| Card/section icon | 20px | `size-5` |
| Empty state / hero | 48px | `size-12` |

**Rule:** Icons are always `text-muted-foreground` unless they carry semantic meaning (status color) or are inside a primary button.

---

## Component patterns

### Buttons

| Variant | When to use |
|---------|------------|
| `default` (primary blue) | Main action per screen — max 1 per view |
| `secondary` (gray surface) | Secondary actions |
| `ghost` (transparent) | Toolbar actions, icon buttons |
| `destructive` (red) | Delete confirmations only |
| `outline` (border only) | Alternative secondary style |

**Rule:** One primary button per screen. Everything else is secondary or ghost.

### Cards

```
bg-card rounded-lg border border-border p-4
```

Cards are the primary content container. Use for project cards, kanban cards, sidebar items. Hover state: `hover:bg-accent transition-colors`.

### Inputs

```
bg-input border border-border rounded-md px-3 py-2 text-sm
placeholder:text-muted-foreground focus:ring-2 focus:ring-ring
```

Always use shadcn `<Input>` — never custom input styling.

### Status pills

```
<span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
  style={{ backgroundColor: 'hsl(var(--status-{status}) / 0.15)', color: 'hsl(var(--status-{status}))' }}>
  <span className="size-1.5 rounded-full bg-current" />
  {label}
</span>
```

Status pills use a 15% opacity background of the status color with full-color text. The small dot reinforces the color.

### Progress bars

```
<div className="h-1.5 w-full rounded-full bg-muted">
  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
</div>
```

Thin (6px), rounded, muted background. Fill uses primary blue.

---

## Layout patterns

### Dashboard (project cards)

```
Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
Card: project name + description + progress bar + status summary
Empty state: centered icon + text + CTA button
```

### Kanban (feature board)

```
Columns: flex overflow-x-auto gap-4, each column min-w-[280px]
Column header: status label (colored) + count badge
Cards: draggable, show title + priority + ticket count + progress
```

Kanban columns use status colors only in the column header dot/label. Cards themselves stay monochromatic.

### Feature View (three-panel)

```
┌──────────┬──────────────────┬──────────────────┐
│ Sidebar  │  Plan viewer     │  Chat            │
│ 280px    │  flex-1          │  380px           │
│ fixed    │  scrollable      │  fixed           │
└──────────┴──────────────────┴──────────────────┘
```

- **Sidebar:** `w-[280px] bg-card border-r`, list of tickets with status dots
- **Plan viewer:** `flex-1 overflow-y-auto p-6`, rendered markdown
- **Chat:** `w-[380px] bg-card border-l`, message list + input

Panels separated by `border-border`. No shadows between panels.

---

## Interaction patterns

| State | Style |
|-------|-------|
| Hover | `bg-accent` (subtle gray shift) |
| Active/pressed | `bg-accent` + slight scale if button |
| Focus | `ring-2 ring-ring ring-offset-2 ring-offset-background` |
| Selected | `bg-accent` + `text-accent-foreground` or left border accent |
| Disabled | `opacity-50 cursor-not-allowed` |
| Loading | Skeleton with `bg-muted animate-pulse rounded` |

---

## Scrollbars

Custom scrollbars for dark mode:
- **`.scrollbar-hide`** — completely hidden (for horizontal scroll containers)
- **`.scrollbar-thin`** — 6px width, gray thumb on transparent track

---

## Do NOT

- Use box-shadow for elevation — use borders and surface hierarchy instead
- Use opacity for text hierarchy — use `muted-foreground` token
- Add color to non-status elements — the UI is monochromatic by design
- Use more than one primary (blue) button per screen
- Hardcode hex/rgb values — always use CSS variables via Tailwind tokens
- Use `font-family` — Poppins is global
- Create custom components when shadcn/ui has one
- Use arbitrary Tailwind values (`p-[13px]`) — stick to the scale
