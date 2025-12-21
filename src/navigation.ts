import {createNavigation} from 'next-intl/navigation';
import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ka', 'en', 'ru'],
  defaultLocale: 'ka',
  localePrefix: 'as-needed', 
  localeDetection: false, 

  pathnames: {
    '/': '/',
    '/cart': '/cart',
    '/wishlist': { // ✅ ეს აუცილებელია, რომ 404 არ მოხდეს გადართვისას
      ka: '/wishlist',
      en: '/wishlist',
      ru: '/wishlist',
    },
    '/checkout': '/checkout',
    '/checkout/success': '/checkout/success',
    '/track-order': '/track-order',
    '/track-order/[id]': '/track-order/[id]',
    '/brands': '/brands',
    '/sale': '/sale',
    '/shop': {
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