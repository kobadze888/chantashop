// src/proxy.ts

import createMiddleware from 'next-intl/middleware';
import {routing} from './navigation';
import {NextRequest, NextResponse} from 'next/server';

export default function middleware(request: NextRequest) {
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

// ✅ საბოლოო კორექტირება: გამოვრიცხავთ ყველა ფაილურ და API მარშრუტს ენის ლოგიკიდან
export const config = {
  matcher: [
    // ენის როუტინგი შეეხება მხოლოდ ამათ:
    '/',
    '/(ka|en|ru)/:path*',

    // გამოვრიცხავთ API მარშრუტებს
    '/((?!api|_next|.*\\..*).*)', 
  ]
};