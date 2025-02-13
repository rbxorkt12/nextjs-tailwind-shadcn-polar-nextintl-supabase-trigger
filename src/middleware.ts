import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'

// Create intl middleware
const intlMiddleware = createIntlMiddleware({
    locales: ['en', 'ko'],
    localePrefix: 'always',
    defaultLocale: 'ko',
})

console.log('process.env.DEBUG_MODE', process.env.DEBUG_MODE)
const DEBUG_MIDDLEWARE = process.env.DEBUG_MODE === 'true'

const log = {
    debug: (...args: any[]) => {
        if (DEBUG_MIDDLEWARE) {
            console.log('[Middleware]', ...args)
        }
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    log.debug(`Request path: ${pathname}`)
    log.debug(`Method: ${request.method}`)
    log.debug(`Headers:`, Object.fromEntries(request.headers))

    // Completely skip middleware for API routes
    if (pathname.startsWith('/api/')) {
        log.debug(`Skipping middleware for API route: ${pathname}`)
        return NextResponse.next()
    }

    // Create supabase server client
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    const cookie = request.cookies.get(name)
                    log.debug(`Getting cookie: ${name}=${cookie?.value}`)
                    return cookie?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    log.debug(`Setting cookie: ${name}=${value}`)
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    log.debug(`Removing cookie: ${name}`)
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    // Refresh session if expired - required for Server Components
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
        log.debug(`Auth error:`, error)
    } else if (user) {
        log.debug(`Authenticated user:`, user.id)
    }

    // If accessing protected routes
    if (pathname.startsWith('/dashboard')) {
        log.debug(`Checking dashboard access for path: ${pathname}`)
        if (error || !user) {
            log.debug(`Unauthorized dashboard access attempt`)
            // Get locale from referer or fallback to pathname or default 'ko'
            const referer = request.headers.get('referer')
            let locale = 'ko' // default locale

            if (referer) {
                // Extract locale from referer URL
                const refererUrl = new URL(referer)
                const refererLocale = refererUrl.pathname.split('/')[1]
                if (['en', 'ko'].includes(refererLocale)) {
                    locale = refererLocale
                }
            } else {
                // Fallback to pathname locale if no referer
                const pathnameLocale = pathname.split('/')[1]
                if (['en', 'ko'].includes(pathnameLocale)) {
                    locale = pathnameLocale
                }
            }

            const redirectUrl = new URL(`/${locale}/sign-in`, request.url)
            redirectUrl.searchParams.set('redirect_url', request.url)
            log.debug(`Redirecting to:`, redirectUrl.toString())
            return NextResponse.redirect(redirectUrl)
        }
    }

    // Update response headers only for non-API routes
    const response = intlMiddleware(request)
    const newCookies = request.cookies.getAll()
    log.debug(`Updating cookies for response. Count:`, newCookies.length)
    newCookies.forEach(cookie => {
        log.debug(`Setting response cookie: ${cookie.name}`)
        response.cookies.set({
            name: cookie.name,
            value: cookie.value,
            path: '/',
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production'
        })
    })

    return response
}

export const config = {
    matcher: [
        // Skip all API routes and static files more explicitly
        '/((?!api/|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}