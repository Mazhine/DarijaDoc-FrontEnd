import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { AUTH_COOKIE } from './lib/auth';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request);
  const pathname = request.nextUrl.pathname;
  const isProtectedAdminRoute = /^\/(fr|en|ar)\/admin(?:\/.*)?$/.test(pathname);

  if (!isProtectedAdminRoute) {
    return response;
  }

  const sessionCookie = request.cookies.get(AUTH_COOKIE)?.value;
  if (sessionCookie) {
    return response;
  }

  const locale = pathname.split('/')[1] || 'fr';
  return NextResponse.redirect(new URL(`/${locale}/auth`, request.url));
}

export const config = {
  matcher: ['/', '/(ar|en|fr)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
