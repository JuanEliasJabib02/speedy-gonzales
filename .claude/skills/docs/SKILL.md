---
name: docs
description: Use when the user wants to create a new public documentation page. Creates a Server Component page inside the docs wiki following the established pattern.
---

# Create Docs Page

When this skill is triggered, create a new public documentation page for Speedy Gonzales.

## Steps

1. Ask the user what the doc page is about (topic, audience, key sections) — or infer from context
2. Read the existing docs layout at `src/app/[locale]/(public-routes)/docs/layout.tsx` for the nav/styling pattern
3. Read an existing docs page (e.g. `sync/page.tsx` or `chat/page.tsx`) to match the content structure
4. Create the new page at `src/app/[locale]/(public-routes)/docs/<slug>/page.tsx`
5. Add a section card to the docs landing page at `src/app/[locale]/(public-routes)/docs/page.tsx`

## Page template

Every docs page must follow this structure:

```tsx
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function <Name>DocsPage() {
  return (
    <div className="space-y-10">
      {/* Back link + title */}
      <div>
        <Link href="/docs" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="size-3" />
          Back to Docs
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">Page Title</h1>
        <p className="mt-2 text-muted-foreground">Short description.</p>
      </div>

      {/* Sections */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Section Title</h2>
        <p className="leading-relaxed text-muted-foreground">Content here.</p>
      </section>
    </div>
  )
}
```

## Rules

- **Server Components only** — never add "use client" to docs pages
- Use `next/link` (not the i18n Link) — docs are public, no locale prefix needed in links
- Use design system tokens — `text-muted-foreground`, `bg-muted`, `border-border`, etc.
- Code snippets use `<code>` with `rounded bg-muted px-1.5 py-0.5 text-sm` classes
- Multi-line code blocks use `<pre>` with `overflow-x-auto rounded-lg bg-muted p-4 text-sm`
- Step-by-step flows use numbered circles (see sync page for the pattern)
- Every page has a "Back to Docs" link at the top
- Always add the new page to the landing page's `sections` array with icon, title, description, and href
- Content must be accurate to the actual implementation — read the relevant source code before writing
- Write in English, concise and technical
