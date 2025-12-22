import type { MetadataRoute } from 'next'
import { locales, defaultLocale } from '@/lib/i18n/config'
import fs from 'fs'
import path from 'path'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://imagetourl.cloud'

// Protected routes that should be excluded from the sitemap
const EXCLUDED_ROUTES = ['/admin', '/auth', '/dashboard']

/**
 * Checks if a route is public (should be included in sitemap)
 */
function isPublicRoute(route: string): boolean {
  for (const excluded of EXCLUDED_ROUTES) {
    if (route === excluded || route.startsWith(excluded + '/')) {
      return false
    }
  }
  return true
}

/**
 * Converts a filesystem directory path to a URL route
 */
function pathToRoute(dirPath: string, baseDir: string): string {
  const relativePath = path.relative(baseDir, dirPath)

  if (!relativePath || relativePath === '.') {
    return ''
  }

  return '/' + relativePath.split(path.sep).join('/')
}

/**
 * Recursively walks a directory to find all page.tsx files
 */
function walkDirectory(dir: string, baseDir: string): string[] {
  const routes: string[] = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue

    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      routes.push(...walkDirectory(fullPath, baseDir))
    } else if (entry.name === 'page.tsx') {
      const route = pathToRoute(dir, baseDir)
      routes.push(route)
    }
  }

  return routes
}

/**
 * Scans the filesystem to discover all public routes
 */
function scanPublicRoutes(baseDir: string): string[] {
  if (!fs.existsSync(baseDir)) {
    throw new Error(`Directory not found: ${baseDir}`)
  }

  const allRoutes = walkDirectory(baseDir, baseDir)
  const publicRoutes = allRoutes.filter(isPublicRoute)
  publicRoutes.sort()

  if (process.env.NODE_ENV === 'development') {
    console.log(`Sitemap: Discovered ${publicRoutes.length} public routes`)
  }

  return publicRoutes
}

// Dynamically discover all public routes from the filesystem
const publicRoutes = scanPublicRoutes(
  path.join(process.cwd(), 'app', '[locale]')
)

export default function sitemap(): MetadataRoute.Sitemap {
    const entries: MetadataRoute.Sitemap = []

    // Generate entries for each route and locale
    for (const route of publicRoutes) {
        for (const locale of locales) {
            const url = `${BASE_URL}/${locale}${route}`

            // Create language alternates for this route
            const languages: Record<string, string> = {}
            for (const altLocale of locales) {
                languages[altLocale] = `${BASE_URL}/${altLocale}${route}`
            }
            // Add x-default pointing to default locale
            languages['x-default'] = `${BASE_URL}/${defaultLocale}${route}`

            entries.push({
                url,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: locale === defaultLocale ? 1.0 : 0.8,
                alternates: {
                    languages,
                },
            })
        }
    }

    return entries
}
