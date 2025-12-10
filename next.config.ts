// next.config.ts
import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'chantashop.ge' }, // შენი WP დომენი
      { protocol: 'https', hostname: 'secure.gravatar.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  
  // ✅ დაემატა: Edge Cache-ის კონტროლი
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // ეს ჰედერი ეუბნება Vercel/CDN-ს, რომ არ მოახდინოს HTML-ის ქეშირება გეოგრაფიულად
          {
            key: 'CDN-Cache-Control',
            value: 'no-store',
          },
          // ეს ჰედერი ეუბნება ბრაუზერს, რომ HTML-ის ქეშირება მოხდეს ძალიან მცირე დროით
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);