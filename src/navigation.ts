// src/navigation.ts

import {createNavigation} from 'next-intl/navigation';
import {defineRouting} from 'next-intl/routing';

// ✅ Pathnames ტიპი კვლავ საჭიროა ექსპორტისთვის, მაგრამ არა createNavigation-ისთვის
export type Pathnames = {
  '/collection': {
    ka: '/shop';
    en: '/shop';
    ru: '/shop';
  };
  '/product/[slug]': '/product/[slug]';
  '/track-order/[id]': '/track-order/[id]';
  '/': '/';
  '/cart': '/cart';
  '/checkout': '/checkout';
  '/checkout/success': '/checkout/success';
  '/track-order': '/track-order';
};

export const routing = defineRouting({
  locales: ['ka', 'en', 'ru'],
  defaultLocale: 'ka',
  localePrefix: 'as-needed',
  localeDetection: false, 

  pathnames: {
    '/': '/', 
    '/cart': '/cart',
    '/checkout': '/checkout',
    '/checkout/success': '/checkout/success',
    '/track-order': '/track-order',
    '/track-order/[id]': '/track-order/[id]',
    '/product/[slug]': '/product/[slug]', 
    '/collection': {
      ka: '/shop',
      en: '/shop',
      ru: '/shop',
    },
  },
});

// ✅ შესწორება: მოვაცილეთ ექსპლიციტური ტიპი <Pathnames>
export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);