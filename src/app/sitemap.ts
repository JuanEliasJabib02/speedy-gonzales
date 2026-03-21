import type { MetadataRoute } from "next"
import { LOCALES } from "../i18n/locales"

/**
 * Dynamic sitemap generator — Next.js serves this at /sitemap.xml
 *
 * Search engines (Google, Bing) read sitemap.xml to discover all pages.
 * This generates one entry per route × locale, e.g.:
 *   https://example.com/en
 *   https://example.com/es
 *   https://example.com/en/faq
 *   https://example.com/es/faq
 *   ...
 *
 * When you add a new public route, add it to `staticRoutes` so crawlers find it.
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

const staticRoutes = ["/", "/faq", "/memberships"]

export default function sitemap(): MetadataRoute.Sitemap {
  return staticRoutes.flatMap((route) =>
    LOCALES.map((locale: string) => ({
      url: `${BASE_URL}/${locale}${route === "/" ? "" : route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "/" ? 1 : 0.8,
    })),
  )
}
