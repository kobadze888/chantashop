import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'chantashop.ge',
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // --- დაამატე შენი WordPress-ის დომენი აქ ---
      {
        protocol: 'https',
        hostname: 'sheni-wordpress-domaini.ge', // <--- შეცვალე ეს შენი რეალური დომენით (მაგ: wp.chantashop.ge)
      },
    ],
  },
};

export default withNextIntl(nextConfig);