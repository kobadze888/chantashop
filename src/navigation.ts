// src/navigation.ts
import {createNavigation} from 'next-intl/navigation';
import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ka', 'en', 'ru'],
  defaultLocale: 'ka',
  localePrefix: 'as-needed', // ✅ ეს უზრუნველყოფს, რომ 'ka' პრეფიქსი არ ჩანს
  localeDetection: false, 

  pathnames: {
    '/': '/',
    '/cart': '/cart',
    '/checkout': '/checkout',
    '/checkout/success': '/checkout/success',
    '/track-order': '/track-order',
    '/track-order/[id]': '/track-order/[id]',
    '/brands': '/brands',
    '/sale': '/sale',
    '/shop': { // ✅ აქ /shop უნდა იყოს ყველა ენისთვის (ან თარგმნილი სლაგები)
      ka: '/shop',
      en: '/shop',
      ru: '/shop',
    },
    '/product/[slug]': {
      ka: '/product/[slug]',
      en: '/product/[slug]',
      ru: '/product/[slug]',
    },
    '/product-category/[slug]': '/product-category/[slug]',
    '/[...slug]': '/[...slug]', 
  },
});

export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);