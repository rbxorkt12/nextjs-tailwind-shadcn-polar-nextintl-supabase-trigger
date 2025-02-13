'use client'

import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { UserProfileDropdown } from '@/components/auth/UserProfileDropdown'
import { Button } from '@/components/ui/button'
import {
    LayoutDashboard,
    Users,
    ChevronDown,
    RefreshCw,
    RotateCw,
    LineChart,
    Zap
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { toast } from 'sonner'

import NotificationBell from '@/components/notification/notification-bell'
export default function LoginNavbar() {
    const t = useTranslations('Navbar')
    const locale = useLocale()

    const handleRefreshAccounts = async () => {
        try {
            const response = await fetch('/api/threads/refresh', {
                method: 'POST',
            });
            if (!response.ok) throw new Error('Refresh failed');
            // 성공 시 페이지 새로고침
            window.location.reload();
        } catch (error) {
            console.error('Failed to refresh accounts:', error);
            toast.error(t('refreshFailed'));
        }
    }

    const handleSyncPosts = async () => {
        try {
            const response = await fetch('/api/threads/sync', {
                method: 'POST',
            });
            if (!response.ok) throw new Error('Sync failed');
            toast.success(t('syncSuccess'));
            // 성공 시 페이지 새로고침
            window.location.reload();
        } catch (error) {
            console.error('Failed to sync posts:', error);
            toast.error(t('syncFailed'));
        }
    }

    return (
        <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-8">
                        <div className="flex-shrink-0">
                            <Link href={`/${locale}/dashboard`} className="flex items-center space-x-2">
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

                        <div className="hidden md:flex items-center gap-4">
                            <Link href={`/${locale}/dashboard`}>
                                <Button variant="ghost" className="flex items-center gap-2">
                                    <LayoutDashboard className="h-4 w-4" />
                                    {t('dashboard')}
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <LanguageSwitcher />
                        <UserProfileDropdown />
                        {/* <NotificationBell /> */}
                    </div>
                </div>
            </div>

            {/* 모바일 메뉴 - md 브레이크포인트 이하에서만 표시 */}
            <div className="md:hidden border-t">
                <div className="flex justify-around py-2">
                    <Link href={`/${locale}/dashboard`}>
                        <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1">
                            <LayoutDashboard className="h-4 w-4" />
                            <span className="text-xs">{t('dashboard')}</span>
                        </Button>
                    </Link>

                </div>
            </div>
        </nav>
    )
} 