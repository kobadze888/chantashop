// src/navigation.ts
import {createNavigation} from 'next-intl/navigation';
import {defineRouting} from 'next-intl/routing';

// ✅ 1. განსაზღვრეთ Pathnames ტიპი, რომელიც მოიცავს დინამიურ გზებს
export type Pathnames = {
  '/collection': {
    ka: '/shop';
    en: '/shop';
    ru: '/shop';
  };
  // ✅ დაემატა დინამიური გზა
  '/product/[slug]': '/product/[slug]';
  '/': '/';
  '/cart': '/cart';
  '/checkout': '/checkout';
  '/checkout/success': '/checkout/success';
  '/track-order': '/track-order';
  '/track-order/[id]': '/track-order/[id]';
};

// ✅ 2. განაახლეთ routing ობიექტი
export const routing = defineRouting({
  locales: ['ka', 'en', 'ru'],
  defaultLocale: 'ka',
  localePrefix: 'as-needed',
  
  localeDetection: false, 

  pathnames: {
    '/': '/', // დავამატოთ სტატიკური გზებიც
    '/cart': '/cart',
    '/checkout': '/checkout',
    '/checkout/success': '/checkout/success',
    '/track-order': '/track-order',
    '/track-order/[id]': '/track-order/[id]',
    '/product/[slug]': '/product/[slug]', // დავამატოთ დინამიური გზა
    '/collection': {
      ka: '/shop',
      en: '/shop',
      ru: '/shop',
    },
  },
});

// ✅ 3. გამოიყენეთ Pathnames ტიპი createNavigation-ში
export const {Link, redirect, usePathname, useRouter} = createNavigation<Pathnames>(routing);