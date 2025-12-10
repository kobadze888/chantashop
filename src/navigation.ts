// src/navigation.ts
import {createNavigation} from 'next-intl/navigation';
import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ka', 'en', 'ru'],
  defaultLocale: 'ka',
  localePrefix: 'as-needed',
  
  // 🛑 ეს აუცილებელია, რომ ბრაუზერის ენაზე არ გადახტეს
  localeDetection: false, 

  pathnames: {
    '/collection': {
      ka: '/shop',
      en: '/shop',
      ru: '/shop',
    },
  },
});

export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);