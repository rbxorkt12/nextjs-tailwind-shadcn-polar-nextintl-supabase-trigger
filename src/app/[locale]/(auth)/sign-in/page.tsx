'use client'

import { SignInForm } from "@/components/auth/SignInForm"
import { useTranslations } from 'next-intl'

export default function SignIn() {
    const t = useTranslations()

    return (
        <div className="flex min-h-screen">
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-500 to-purple-600 justify-center items-center p-8">
                <div className="max-w-md text-white space-y-4">
                    <h1 className="text-4xl font-bold">{t('auth.welcome')}</h1>
                    <p className="text-lg opacity-90">{t('auth.signIn.marketingText')}</p>
                </div>
            </div>

            <div className="flex flex-col justify-center w-full lg:w-1/2 p-8">
                <SignInForm />
            </div>
        </div>
    )
} 