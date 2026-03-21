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
  "/(en|es|pt)/dashboard(.*)",
  "/(en|es|pt)/projects(.*)",
])

const isLoginRoute = createRouteMatcher(["/(en|es|pt)/login"])

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
)

export const config = {
  matcher: [
    "/",
    "/(es|en|pt)/:path*",
    "/api/auth(.*)",
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
}
