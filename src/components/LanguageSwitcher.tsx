'use client';

import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

const languages = [
    { code: 'ko', name: '한국어' },
    { code: 'en', name: 'English' },
] as const;

export function LanguageSwitcher() {
    const pathname = usePathname();
    const currentLocale = useLocale();

    const handleLanguageChange = (newLocale: string) => {
        const segments = pathname.split('/');

        // If the current path has a locale, replace it
        if (['en', 'ko'].includes(segments[1])) {
            segments[1] = newLocale;
        } else {
            // If no locale in path, add the new locale at the beginning
            segments.splice(1, 0, newLocale);
        }

        const newPath = segments.join('/');
        window.location.href = newPath;
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-9 px-0">
                    <Globe className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {languages.map((language) => (
                    <DropdownMenuItem
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className={currentLocale === language.code ? "bg-accent" : ""}
                    >
                        {language.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
} 