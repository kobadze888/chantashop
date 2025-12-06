// ფაილის გზა: next.config.ts

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
      // Headless WordPress API Hostname
      {
        protocol: 'https',
        hostname: 'chantashop.ge', 
      },
      // ✅ PLACEHOLDER HOSTNAME ADDED
      {
        protocol: 'https',
        hostname: 'placehold.co', 
      },
    ],
  },
};

export default withNextIntl(nextConfig);