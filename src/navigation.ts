// src/navigation.ts

import {createNavigation} from 'next-intl/navigation';
import {defineRouting} from 'next-intl/routing';

// ✅ დავამატეთ '/brands' და '/sale' ტიპებში
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
  '/brands': '/brands'; // <-- ახალი
  '/sale': '/sale';     // <-- ახალი
};

export const routing = defineRouting({
  locales: ['ka', 'en', 'ru'],
  defaultLocale: 'ka',
  localePrefix: 'as-needed',
  localeDetection: false, 

  // ✅ დავამატეთ '/brands' და '/sale' კონფიგურაციაში
  pathnames: {
    '/': '/', 
    '/cart': '/cart',
    '/checkout': '/checkout',
    '/checkout/success': '/checkout/success',
    '/track-order': '/track-order',
    '/track-order/[id]': '/track-order/[id]',
    '/product/[slug]': '/product/[slug]', 
    '/brands': '/brands', // <-- დაემატა
    '/sale': '/sale',     // <-- დაემატა
    '/collection': {
      ka: '/shop',
      en: '/shop',
      ru: '/shop',
    },
  },
});

export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);