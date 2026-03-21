import type { Metadata } from "next"

/**
 * Reusable metadata factory for SEO across all pages.
 *
 * Next.js reads the exported `metadata` object from any page/layout
 * and automatically injects <title>, <meta>, and Open Graph / Twitter
 * tags into the <head>.
 *
 * Usage in any page:
 *   export const metadata = createMetadata({ title: "FAQ", path: "/faq" })
 *
 * If called with no args it returns the site-wide defaults (used in root layout).
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

const defaults = {
  title: "My App",
  description: "Built with Next.js and Convex",
} as const

interface MetadataOptions {
  title?: string
  description?: string
  path?: string
  image?: string
}

export function createMetadata({
  title,
  description,
  path = "/",
  image,
}: MetadataOptions = {}): Metadata {
  // "FAQ | Reset" for sub-pages, just "Reset" for the home
  const finalTitle = title ? `${title} | ${defaults.title}` : defaults.title
  const finalDescription = description ?? defaults.description
  const url = `${BASE_URL}${path}`
  const ogImage = image ?? `${BASE_URL}/og-image.png`

  return {
    title: finalTitle,
    description: finalDescription,
    // metadataBase lets you use relative paths in images/alternates
    metadataBase: new URL(BASE_URL),
    // canonical URL avoids duplicate-content penalties in search engines
    alternates: { canonical: url },
    // Open Graph: what Facebook, LinkedIn, Slack, etc. show when sharing a link
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url,
      siteName: defaults.title,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type: "website",
    },
    // Twitter Card: what Twitter/X shows when sharing a link
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDescription,
      images: [ogImage],
    },
  }
}
