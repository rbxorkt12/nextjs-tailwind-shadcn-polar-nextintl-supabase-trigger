'use client'

import { signIn, signInWithOAuth } from '@/lib/auth/actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { useLocale } from 'next-intl'
import { useToast } from '@/hooks/use-toast'

export function SignInForm() {
    const t = useTranslations()
    const { toast } = useToast()
    const locale = useLocale()

    const handleSubmit = async (formData: FormData) => {
        const result = await signIn(formData)
        if (result?.error) {
            console.log(result.error)
            toast({
                variant: "destructive",
                title: t('auth.signIn.error'),
                description: result.error,
            })
        }
    }

    const handleOAuthSignIn = async (provider: 'google' | 'github') => {
        const result = await signInWithOAuth(provider)
        if (result?.error) {
            toast({
                variant: "destructive",
                title: t('auth.signIn.error'),
                description: result.error,
            })
        }
    }

    return (
        <div className="w-full max-w-md mx-auto space-y-8">
            <div className="text-center space-y-4">
                <Logo className="justify-center" size={48} />
                <h2 className="text-2xl font-bold">{t('auth.signIn.title')}</h2>
                <p className="text-gray-600">{t('auth.signIn.subtitle')}</p>
            </div>

            <form action={handleSubmit} className="space-y-4">
                <input type="hidden" name="locale" value={locale} />
                <Input
                    type="email"
                    name="email"
                    placeholder={t('auth.email')}
                    required
                />
                <Input
                    type="password"
                    name="password"
                    placeholder={t('auth.password')}
                    required
                />
                <Button
                    type="submit"
                    className="w-full"
                >
                    {t('auth.signIn.submit')}
                </Button>
            </form>

            <div className="space-y-4">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">
                            {t('auth.signIn.orContinueWith')}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleOAuthSignIn('google')}
                    >
                        Google
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleOAuthSignIn('github')}
                    >
                        GitHub
                    </Button>
                </div>
            </div>

            <p className="text-center text-sm text-gray-600">
                {t('auth.signIn.noAccount')}{' '}
                <Link href={`/${locale}/sign-up`} className="text-primary hover:underline font-medium">
                    {t('auth.signIn.signUp')}
                </Link>
            </p>
        </div>
    )
} 