'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useLocale } from 'next-intl'

export default function NotFound() {
    const t = useTranslations('Common')
    const locale = useLocale()

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-lg w-full text-center">
                <h1 className="text-6xl font-bold text-gray-900">404</h1>
                <h2 className="mt-4 text-3xl font-semibold text-gray-800">
                    {t('pageNotFound')}
                </h2>
                <p className="mt-4 text-gray-600">
                    {t('pageNotFoundDescription')}
                </p>
                <Link
                    href={`/${locale}/dashboard`}
                    className="mt-8 inline-block px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                >
                    {t('backToHome')}
                </Link>
            </div>
        </div>
    )
}
