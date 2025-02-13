import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    // 지원하는 모든 로케일 리스트
    locales: ['ko', 'en', 'ja'],

    // 매칭되는 로케일이 없을 때 사용
    defaultLocale: 'ko'
});

// Next.js의 navigation API를 감싸서 라우팅 설정을 고려하도록 함
export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);

