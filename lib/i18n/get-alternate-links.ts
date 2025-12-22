import { locales, defaultLocale, type Locale } from "./config"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://imagetourl.cloud"

export function getAlternateLinks(pathname: string, currentLocale: Locale) {
  // Remove locale prefix from pathname
  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "") || "/"

  // Generate language alternates with absolute URLs (required for proper hreflang)
  const languages: Record<string, string> = {}

  for (const locale of locales) {
    languages[locale] = `${BASE_URL}/${locale}${pathnameWithoutLocale === "/" ? "" : pathnameWithoutLocale}`
  }

  // Add x-default pointing to default locale (tells search engines the fallback)
  languages["x-default"] = `${BASE_URL}/${defaultLocale}${pathnameWithoutLocale === "/" ? "" : pathnameWithoutLocale}`

  return languages
}

// Legacy format for backward compatibility
export function getAlternateLinksList(pathname: string, currentLocale: Locale) {
  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "") || "/"

  return locales.map((locale) => ({
    locale,
    url: `${BASE_URL}/${locale}${pathnameWithoutLocale === "/" ? "" : pathnameWithoutLocale}`,
  }))
}
