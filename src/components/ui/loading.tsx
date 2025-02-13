'use client'

import { Loader2 } from "lucide-react"

export function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center w-full h-full min-h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
}

export function LoadingOverlay() {
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
} 