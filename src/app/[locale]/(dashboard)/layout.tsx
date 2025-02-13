import LoginNavbar from "@/components/navbar/login-navbar"
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getLocale } from 'next-intl/server'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const locale = await getLocale()

    if (!user) {
        redirect(`/${locale}/sign-in`)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <LoginNavbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <main className="bg-white rounded-lg shadow-sm">
                    {children}
                </main>
            </div>
        </div>
    )
} 