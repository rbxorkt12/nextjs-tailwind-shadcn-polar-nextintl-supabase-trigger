import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Card } from "@/components/ui/card"

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('Privacy')

    return {
        title: t('metadata.title'),
        description: t('metadata.description'),
        openGraph: {
            title: t('metadata.title'),
            description: t('metadata.description'),
        }
    }
}

export default async function Privacy() {
    const t = await getTranslations('Privacy')

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
                            <h2 className="text-2xl font-semibold">{t('sections.dataCollection.title')}</h2>
                            <p>{t('sections.dataCollection.content')}</p>
                            <ul className="list-disc pl-6 space-y-2">
                                {['personal', 'usage', 'technical'].map((item) => (
                                    <li key={item}>
                                        {t(`sections.dataCollection.items.${item}`)}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">{t('sections.dataUse.title')}</h2>
                            <p>{t('sections.dataUse.content')}</p>
                            <ul className="list-disc pl-6 space-y-2">
                                {['service', 'improvement', 'communication'].map((item) => (
                                    <li key={item}>
                                        {t(`sections.dataUse.items.${item}`)}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">{t('sections.dataSecurity.title')}</h2>
                            <p>{t('sections.dataSecurity.content')}</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">{t('sections.cookies.title')}</h2>
                            <p>{t('sections.cookies.content')}</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">{t('sections.thirdParty.title')}</h2>
                            <p>{t('sections.thirdParty.content')}</p>
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