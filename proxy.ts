import { type NextRequest, NextResponse } from "next/server"
import { locales, defaultLocale } from "@/lib/i18n/config"
import { updateSession } from "@/lib/supabase/middleware"

function getLocale(request: NextRequest): string {
  // Check if locale is in pathname
  const pathname = request.nextUrl.pathname
  const pathnameLocale = locales.find((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)

  if (pathnameLocale) return pathnameLocale

  // Check Accept-Language header
  const acceptLanguage = request.headers.get("accept-language")
  if (acceptLanguage) {
    const browserLocale = acceptLanguage.split(",")[0].split("-")[0].toLowerCase()

    if (locales.includes(browserLocale)) {
      return browserLocale
    }
  }

  return defaultLocale
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)

  // Handle locale redirect
  if (!pathnameHasLocale) {
    const locale = getLocale(request)
    request.nextUrl.pathname = `/${locale}${pathname}`
    // Use permanent redirect (301) for SEO - tells search engines this is the canonical URL
    return NextResponse.redirect(request.nextUrl, { status: 301 })
  }

  // Update Supabase session
  const { supabaseResponse, user } = await updateSession(request)

  // Protect dashboard routes
  if (pathname.includes("/dashboard")) {
    if (!user) {
      const locale = pathname.split("/")[1] || defaultLocale
      const redirectUrl = new URL(`/${locale}/auth/login`, request.url)
      redirectUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, etc.)
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
}
