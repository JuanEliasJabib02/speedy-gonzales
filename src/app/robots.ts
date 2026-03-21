import type { MetadataRoute } from "next"

/**
 * Dynamic robots.txt generator — Next.js serves this at /robots.txt
 *
 * robots.txt tells search engine crawlers which paths they can/cannot index.
 *   - allow "/"       → crawl all public pages
 *   - disallow /api/  → don't index API routes
 *   - disallow /_next → don't index Next.js internal assets
 *   - sitemap         → points crawlers to the sitemap for full page discovery
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
