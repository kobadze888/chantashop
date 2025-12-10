// src/proxy.ts

import createMiddleware from 'next-intl/middleware';
import {routing} from './navigation';
import {NextRequest, NextResponse} from 'next/server';

export default function middleware(request: NextRequest) {
  // 1. ვამოწმებთ, არის თუ არა მოთხოვნა API-ზე, რათა არ გავუშვათ ენის ლოგიკა.
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/');
  if (isApiRoute) {
    return NextResponse.next();
  }

  // 2. ვქმნით next-intl-ის სტანდარტულ მიდლვეარს
  const handleI18nRouting = createMiddleware(routing);

  // ... (rest of middleware logic remains the same)

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

// ✅ კონფიგურაცია: ვამუშავებთ მხოლოდ იმ მარშრუტებს, რომლებიც გვინდა
// აქ გამორიცხვას ვაკეთებთ არა regex-ით, არამედ უბრალოდ ვუწერთ ლოკალის პათს.
// თუმცა, რადგან ზემოთ უკვე დავამატეთ if (isApiRoute) { return NextResponse.next(); },
// ამიტომ matcher-ის გამართვა მარტივდება.
export const config = {
  // ამ მეთოდით ვუზრუნველყოფთ, რომ /api ლოგიკამ გაიაროს next-intl-ის გვერდის ავლით.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/']
};