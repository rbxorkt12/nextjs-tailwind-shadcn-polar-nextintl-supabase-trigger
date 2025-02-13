import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Card } from "@/components/ui/card"

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('Terms')

    return {
        title: t('metadata.title'),
        description: t('metadata.description'),
        openGraph: {
            title: t('metadata.title'),
            description: t('metadata.description'),
        }
    }
}

export default async function Terms() {
    const t = await getTranslations('Terms')

    return (
        <main className="flex min-h-screen flex-col py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto w-full">
                <Card className="p-8 space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold">{t('title')}</h1>
                        <p className="text-gray-600 dark:text-gray-300">{t('lastUpdated')}</p>
                    </div>

                    <div className="space-y-8">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">{t('sections.acceptance.title')}</h2>
                            <p>{t('sections.acceptance.content')}</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">{t('sections.services.title')}</h2>
                            <p>{t('sections.services.content')}</p>
                            <ul className="list-disc pl-6 space-y-2">
                                {['automation', 'scheduling', 'analytics'].map((item) => (
                                    <li key={item}>
                                        {t(`sections.services.items.${item}`)}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">{t('sections.accounts.title')}</h2>
                            <p>{t('sections.accounts.content')}</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">{t('sections.payment.title')}</h2>
                            <p>{t('sections.payment.content')}</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">{t('sections.cancellation.title')}</h2>
                            <p>{t('sections.cancellation.content')}</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">{t('sections.prohibited.title')}</h2>
                            <p>{t('sections.prohibited.content')}</p>
                            <ul className="list-disc pl-6 space-y-2">
                                {['spam', 'illegal', 'harmful'].map((item) => (
                                    <li key={item}>
                                        {t(`sections.prohibited.items.${item}`)}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">{t('sections.liability.title')}</h2>
                            <p>{t('sections.liability.content')}</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">{t('sections.changes.title')}</h2>
                            <p>{t('sections.changes.content')}</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">{t('sections.contact.title')}</h2>
                            <p>{t('sections.contact.content')}</p>
                            <p className="font-medium">Email: qkrrnjsqkr12@gmail.com</p>
                        </section>
                    </div>
                </Card>
            </div>
        </main>
    )
} 