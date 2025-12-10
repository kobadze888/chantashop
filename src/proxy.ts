// src/proxy.ts

import createMiddleware from 'next-intl/middleware';
import {routing} from './navigation';
import {NextRequest, NextResponse} from 'next/server';

export default function middleware(request: NextRequest) {
// ... (rest of middleware logic remains the same)

  const handleI18nRouting = createMiddleware(routing);

  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value;
  const { pathname } = request.nextUrl;

  if (
    pathname === '/' && 
    localeCookie && 
    localeCookie !== routing.defaultLocale && 
    routing.locales.includes(localeCookie as any)
  ) {
     return NextResponse.redirect(new URL(`/${localeCookie}`, request.url));
  }

  return handleI18nRouting(request);
}

// ✅ დადასტურდა: /api მარშრუტის გამორიცხვა
export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/']
};