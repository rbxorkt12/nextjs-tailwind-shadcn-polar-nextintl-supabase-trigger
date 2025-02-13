'use client'

import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { useParams } from 'next/navigation';

interface CtaButtonProps {
    href?: string;
    children: React.ReactNode;
    className?: string;
    size?: "default" | "sm" | "lg" | "icon";
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function CtaButton({ href = "/dashboard", children, className, size, variant }: CtaButtonProps) {
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string;

    const handleClick = () => {
        if (href.startsWith('http')) {
            window.location.href = href;
        } else {
            // Remove leading slash if present and add locale
            const path = href.replace(/^\//, '');
            router.push(`/${locale}/${path}`);
        }
    };

    return (
        <Button
            onClick={handleClick}
            className={className}
            size={size}
            variant={variant}
        >
            {children}
        </Button>
    );
} 
