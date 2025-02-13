import Image from 'next/image'
import Link from 'next/link'

export function Logo({ className = '', size = 40 }: { className?: string, size?: number }) {
    return (
        <Link href="/" className={`flex items-center gap-2 ${className}`}>
            <Image
                src="/logo.png"
                alt="Idea2Posts Logo"
                width={size}
                height={size}
                className="object-contain"
            />
            <span className="font-bold text-xl">Idea2Posts</span>
        </Link>
    )
} 