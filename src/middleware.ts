import { NextResponse, type NextRequest } from "next/server"
import createNextIntlMiddleware from "next-intl/middleware"
import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server"
import { routing } from "./i18n/routing"

const intlMiddleware = createNextIntlMiddleware(routing)

const isPrivateRoute = createRouteMatcher([
  "/(en|es)/dashboard(.*)",
  "/(en|es)/projects(.*)",
])

const isLoginRoute = createRouteMatcher(["/(en|es)/login"])

export default convexAuthNextjsMiddleware(
  async (request: NextRequest, { convexAuth }) => {
    // Skip intl middleware for API routes — it rewrites paths and breaks auth proxy
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.next()
    }

    const locale = request.nextUrl.pathname.split("/")[1] || "en"
    const isAuthenticated = await convexAuth.isAuthenticated()

    if (isLoginRoute(request) && isAuthenticated) {
      return nextjsMiddlewareRedirect(request, `/${locale}/dashboard`)
    }

    if (isPrivateRoute(request) && !isAuthenticated) {
      return nextjsMiddlewareRedirect(request, `/${locale}/login`)
    }

    return intlMiddleware(request)
  },
  {
    convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL,
    verbose: true,
  },
)

export const config = {
  matcher: [
    "/",
    "/(es|en)/:path*",
    "/api/auth(.*)",
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
}
