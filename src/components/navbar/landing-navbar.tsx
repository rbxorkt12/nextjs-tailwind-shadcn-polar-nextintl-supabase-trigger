import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { MobileMenu } from '@/components/MobileMenu';
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { CtaButton } from '@/components/CtaButton';

export function LandingNavbar() {
    const t = useTranslations('Navigation');
    const DASHBOARD_URL = '/dashboard';
    const navItems = [
        { href: '#features', label: t('features') },
        { href: '#how-it-works', label: t('howItWorks') },
        { href: '#testimonials', label: t('testimonials') },
        { href: '#pricing', label: t('pricing') },
    ];

    return (
        <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center space-x-2">
                            <Image
                                src="/logo.png"
                                alt="Idea2Posts"
                                width={32}
                                height={32}
                                className="h-8 w-auto"
                                priority
                            />
                            <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                                Idea2Posts
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                        <LanguageSwitcher />
                        <CtaButton href={DASHBOARD_URL} size="sm" className="bg-primary text-white">
                            {t('startFree')}
                        </CtaButton>
                    </div>

                    {/* Mobile menu */}
                    <div className="md:hidden flex items-center space-x-2">
                        <LanguageSwitcher />
                        <MobileMenu items={navItems} />
                    </div>
                </div>
            </div>
        </nav>
    );
} 