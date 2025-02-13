'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslations } from 'next-intl'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { useLocale } from 'next-intl'

export function SignUpForm() {
    const locale = useLocale()
    const router = useRouter()
    const t = useTranslations()
    const { toast } = useToast()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        if (password !== confirmPassword) {
            toast({
                variant: "destructive",
                title: t('auth.signUp.passwordMismatch'),
            })
            setLoading(false)
            return
        }

        try {
            const supabase = createClient()
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${NEXT_PUBLIC_SITE_URL}/auth/confirm`,
                },
            })

            if (error) {
                toast({
                    variant: "destructive",
                    title: t('auth.signUp.error'),
                    description: error.message,
                })
                return
            }

            toast({
                variant: "default",
                title: t('auth.signUp.verificationEmailSent'),
            })
            router.push(`/${locale}/sign-in`)
        } catch (error) {
            toast({
                variant: "destructive",
                title: t('auth.signUp.error'),
                description: 'An unexpected error occurred',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md mx-auto space-y-8">
            <div className="text-center space-y-4">
                <Logo className="justify-center" size={48} />
                <h2 className="text-2xl font-bold">{t('auth.signUp.title')}</h2>
                <p className="text-gray-600">{t('auth.signUp.subtitle')}</p>
            </div>

            <form onSubmit={handleSignUp} className="space-y-4">
                <Input
                    type="email"
                    placeholder={t('auth.email')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                    type="password"
                    placeholder={t('auth.password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Input
                    type="password"
                    placeholder={t('auth.signUp.confirmPassword')}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                >
                    {loading ? t('auth.common.loading') : t('auth.signUp.submit')}
                </Button>
            </form>

            <p className="text-center text-sm text-gray-600">
                {t('auth.signUp.alreadyHaveAccount')}{' '}
                <Link href={`/${locale}/sign-in`} className="text-primary hover:underline font-medium">
                    {t('auth.signUp.signIn')}
                </Link>
            </p>
        </div>
    )
} 