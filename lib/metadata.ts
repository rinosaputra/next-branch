import type { Metadata } from 'next'

/**
 * Base metadata configuration
 * Override these values via environment variables or update directly
 */
const BASE_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'Next.js Starter',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  description: 'Opinionated fullstack Next.js starter architecture',
} as const

/**
 * Options for creating page metadata
 */
interface CreateMetadataOptions {
  /**
   * Page title
   * Will be suffixed with site name (e.g., "Login | Next.js Starter")
   */
  title?: string

  /**
   * Page description
   * Falls back to base config description
   */
  description?: string

  /**
   * Canonical URL path (e.g., "/login")
   * Will be prefixed with base URL
   */
  path?: string

  /**
   * Additional keywords for SEO
   */
  keywords?: string[]

  /**
   * Disable search engine indexing
   * @default false
   */
  noIndex?: boolean
}

/**
 * Create Next.js metadata for a page
 *
 * @example
 * ```ts
 * // app/login/page.tsx
 * export const metadata = createMetadata({
 *   title: 'Login',
 *   description: 'Sign in to your account',
 *   path: '/login',
 *   noIndex: true,
 * })
 * ```
 *
 * @example
 * ```ts
 * // app/blog/[slug]/page.tsx
 * export async function generateMetadata({ params }: Props): Promise<Metadata> {
 *   const post = await getPost(params.slug)
 *   return createMetadata({
 *     title: post.title,
 *     description: post.excerpt,
 *     path: `/blog/${params.slug}`,
 *   })
 * }
 * ```
 */
export function createMetadata(options: CreateMetadataOptions = {}): Metadata {
  const {
    title,
    description = BASE_CONFIG.description,
    path = '',
    keywords = [],
    noIndex = false,
  } = options

  // Build full title with site name suffix
  const fullTitle = title ? `${title} | ${BASE_CONFIG.name}` : BASE_CONFIG.name

  // Build canonical URL
  const url = `${BASE_CONFIG.url}${path}`

  return {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,

    // Canonical URL
    alternates: {
      canonical: url,
    },

    // Robots
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
  }
}
