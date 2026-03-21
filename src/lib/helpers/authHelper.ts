import type { NextRequest } from "next/server"
import { PRIVATE_ROUTE_PREFIXES, ROUTES } from "../constants/routes"

export async function isAuthenticated(req: NextRequest) {
	const token = req.cookies.get("access_token")?.value
	return Boolean(token)
}

export const getCurrentLocale = (req: NextRequest): string =>
	req.nextUrl.pathname.split("/")[1] || "en"

export const createUrl = (
	origin: string,
	locale: string,
	path: string,
): string => new URL(`${origin}/${locale}${path}`).toString()

const isPrivateRoute = (pathname: string): boolean => {
	const pathWithoutLocale = pathname.replace(/^\/(en|es|pt)/, "")
	return PRIVATE_ROUTE_PREFIXES.some((prefix) =>
		pathWithoutLocale.startsWith(prefix),
	)
}

const isLoginPage = (pathname: string): boolean => pathname.endsWith("/login")

type RedirectResult = {
	shouldRedirect: boolean
	redirectUrl?: string
}

export const getAuthRedirect = async (
	req: NextRequest,
): Promise<RedirectResult> => {
	const isAuth = await isAuthenticated(req)
	const locale = getCurrentLocale(req)

	const loginUrl = createUrl(req.nextUrl.origin, locale, ROUTES.LOGIN)
	const dashboardUrl = createUrl(req.nextUrl.origin, locale, ROUTES.DASHBOARD)

	if (isLoginPage(req.nextUrl.pathname) && isAuth) {
		return { shouldRedirect: true, redirectUrl: dashboardUrl }
	}

	if (isPrivateRoute(req.nextUrl.pathname) && !isAuth) {
		return { shouldRedirect: true, redirectUrl: loginUrl }
	}

	return { shouldRedirect: false }
}
