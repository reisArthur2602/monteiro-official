import { type NextRequest, NextResponse } from 'next/server';

import { SESSION_COOKIE_NAME } from '@/utils/auth';

const PUBLIC_PATHS = ['/auth'];

export const proxy = (request: NextRequest) => {
    const { pathname } = request.nextUrl;

    const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

    if (isPublicPath) {
        return NextResponse.next();
    }

    const hasSessionCookie = request.cookies.has(SESSION_COOKIE_NAME);

    if (!hasSessionCookie) {
        const url = request.nextUrl.clone();
        url.pathname = '/auth';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
};

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)'],
};
