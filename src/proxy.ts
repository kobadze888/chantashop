import createMiddleware from 'next-intl/middleware';
import {routing} from './navigation';
import {NextRequest, NextResponse} from 'next/server';

export default function middleware(request: NextRequest) {
  // 1. ვქმნით next-intl-ის სტანდარტულ მიდლვეარს
  const handleI18nRouting = createMiddleware(routing);

  // 2. ვამოწმებთ ქუქის (რა ენა აქვს არჩეული მომხმარებელს)
  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value;
  const { pathname } = request.nextUrl;

  // 3. ლოგიკა: 
  // თუ მომხმარებელი შედის მთავარ გვერდზე ('/') 
  // და აქვს არჩეული ენა (მაგ: 'en' ან 'ru'), რომელიც არ არის დეფოლტ (ქართული),
  // მაშინ იძულებით გადაგვყავს იმ ენაზე.
  if (
    pathname === '/' && 
    localeCookie && 
    localeCookie !== routing.defaultLocale && 
    routing.locales.includes(localeCookie as any)
  ) {
     return NextResponse.redirect(new URL(`/${localeCookie}`, request.url));
  }

  // სხვა შემთხვევაში ეშვება სტანდარტული ლოგიკა
  return handleI18nRouting(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/']
};