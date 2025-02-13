'use client'

import { useTranslations } from 'next-intl'
import { SignUpForm } from '@/components/auth/SignUpForm'

export default function SignUp() {
    const t = useTranslations()

    return (
        <div className="flex min-h-screen">
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-500 to-purple-600 justify-center items-center p-8">
                <div className="max-w-md text-white space-y-4">
                    <h1 className="text-4xl font-bold">{t('auth.welcome')}</h1>
                    <p className="text-lg opacity-90">{t('auth.signUp.marketingText')}</p>
                </div>
            </div>

            <div className="flex flex-col justify-center w-full lg:w-1/2 p-8">
                <SignUpForm />
            </div>
        </div>
    )
} 