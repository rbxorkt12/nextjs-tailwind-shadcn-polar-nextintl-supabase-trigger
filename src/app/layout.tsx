import { Inter } from "next/font/google";
import './globals.css'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/Footer'
import { Toaster } from "@/components/ui/sonner";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return children; // Just pass through to the [locale] layout
}