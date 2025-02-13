import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Toaster } from "@/components/ui/toaster"
import { LoadingProvider } from '@/components/providers/loading-provider'
import { cn } from '@/lib/utils'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Footer } from '@/components/Footer'
import { getLocale } from 'next-intl/server'


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata' });

    return {
        title: t('title'),
        description: t('description'),
        openGraph: {
            title: t('og.title'),
            description: t('og.description'),
            images: [
                {
                    url: 'https://Idea2Posts.vercel.app/og-image.png',
                    width: 1200,
                    height: 630,
                    alt: t('og.alt'),
                },
            ],
            locale: locale,
            type: 'website',
            siteName: 'Idea2Posts',
        },
        twitter: {
            card: 'summary_large_image',
            title: t('twitter.title'),
            description: t('twitter.description'),
            images: ['https://Idea2Posts.vercel.app/og-image.png'],
        },
    };
}
const inter = Inter({ subsets: ["latin"] });

const locales = ['en', 'ko'];

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
    params: { locale: string }
}) {

    const locale = await getLocale()
    if (!locales.includes(locale)) {
        notFound();
    }

    const messages = await getMessages({ locale });

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={cn(inter.className, 'bg-background')}>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    {children}
                    <Footer />
                    <Toaster />
                </NextIntlClientProvider>
                <GoogleAnalytics gaId="G-6H90T4V010" />
            </body>
        </html>
    );
} 