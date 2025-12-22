import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { locales, defaultLocale } from "@/lib/i18n/config"

function getLocaleFromHeaders(acceptLanguage: string | null): string {
  if (!acceptLanguage) return defaultLocale

  const browserLocale = acceptLanguage.split(",")[0].split("-")[0].toLowerCase()

  if (locales.includes(browserLocale as typeof locales[number])) {
    return browserLocale
  }

  return defaultLocale
}

export default async function RootPage() {
  const headersList = await headers()
  const acceptLanguage = headersList.get("accept-language")
  const locale = getLocaleFromHeaders(acceptLanguage)

  redirect(`/${locale}`)
}
