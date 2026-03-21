---
name: design-ui
description: Use when the user wants to design or build a new UI component or page. References the project's design system and business model to ensure consistency.
---

# Design UI

When this skill is triggered, design or build UI following the project's design system and business context.

## Steps

1. Read `plans/design-system.md` for design tokens, spacing, colors, and component patterns
2. Read `plans/business-model.md` to understand the business context and ensure the design serves the product goals
3. Read the relevant feature spec from `plans/features/` if designing a specific screen
4. Read `src/styles/globals.css` for the actual CSS variable values
5. Build the UI using shadcn/ui components, Tailwind CSS, and the project's established patterns

## Rules

- **UI ONLY** — never write business logic, data fetching, mutations, or backend code when this skill is active. Design means design.
- Use hardcoded mock data or placeholder text — never connect to real data sources
- Follow the design system — don't invent new patterns
- All designs must make sense for the business (web command center for managing software projects with AI agents)
- Use the existing component library (shadcn/ui) before creating custom components
- Responsive by default
- Dark-mode-first — design for the dark theme, light adapts
- Monochromatic — no color except status indicators and primary blue accent
- Components created here are purely visual — logic gets wired later
