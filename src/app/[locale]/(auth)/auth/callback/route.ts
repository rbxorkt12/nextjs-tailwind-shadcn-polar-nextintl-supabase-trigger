import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
        const supabase = await createClient()

        // code exchange
        await supabase.auth.exchangeCodeForSession(code)

        // Get the next URL or default to dashboard
        const next = requestUrl.searchParams.get('next') ?? '/dashboard'

        // Construct the redirect URL with locale
        const redirectUrl = new URL(next, process.env.NEXT_PUBLIC_SITE_URL)

        return NextResponse.redirect(redirectUrl)
    }

    // If no code, redirect to error page
    return NextResponse.redirect(new URL('/error', process.env.NEXT_PUBLIC_SITE_URL))
}