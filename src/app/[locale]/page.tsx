
import { useTranslations } from 'next-intl';

import { LandingNavbar } from "@/components/navbar/landing-navbar";

export default function Home() {
    const t = useTranslations();


    return (
        <>
            <LandingNavbar />
            <main>
                <div>Test</div>
            </main>
        </>
    );
} 