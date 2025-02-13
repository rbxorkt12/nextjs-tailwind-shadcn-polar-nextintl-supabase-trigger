import { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import { getTranslations, getLocale } from 'next-intl/server'


export const metadata: Metadata = {
    title: 'Dashboard | Idea2Posts',
    description: 'Manage your Thread posts and schedule future content',
}

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const t = await getTranslations('Dashboard')
    const locale = await getLocale()

    if (!user) {
        return null
    }


    return (
        <main className="flex min-h-screen flex-col p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">{t('title')}</h1>
            </div>
        </main>
    )
}
