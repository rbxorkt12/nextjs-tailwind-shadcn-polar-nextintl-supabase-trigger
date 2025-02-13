'use client';

import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';

interface MobileMenuProps {
    items: Array<{ href: string; label: string; }>;
}

export function MobileMenu({ items }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations('Navigation');

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2"
                aria-label="Toggle menu"
            >
                <svg
                    className="h-6 w-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    {isOpen ? (
                        <path d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>

            {/* Mobile Navigation Menu */}
            {isOpen && (
                <div className="absolute top-16 left-0 w-full bg-white border-b md:hidden">
                    <div className="px-4 py-2 space-y-1">
                        {items.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="block px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <Button size="sm" className="w-full mt-4 bg-primary text-white">
                            {t('startFree')}
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
} 