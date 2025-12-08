// src/navigation.ts
import {createNavigation} from 'next-intl/navigation';
import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  // ჩვენი 3 ენა
  locales: ['ka', 'en', 'ru'],
  
  // ნაგულისხმევი ენა (ქართული)
  defaultLocale: 'ka',
  
  // კრიტიკული პარამეტრი: 'as-needed' მალავს /ka/ პრეფიქსს URL-დან,
  // მაგრამ ტოვებს /en/ და /ru/ პრეფიქსებს.
  localePrefix: 'as-needed',

  // ✅ ახალი pathnames კონფიგურაცია
  pathnames: {
    '/collection': {
      ka: '/shop', // შიდა /collection გვერდი ქართულად იქნება /shop
      en: '/shop', // ინგლისურად იქნება /en/shop
      ru: '/shop', // რუსულად იქნება /ru/shop
    },
  },
});

export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);