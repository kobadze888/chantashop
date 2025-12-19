// next.config.ts
import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  images: {
    // ✅ ჩართულია AVIF და WebP მხარდაჭერა სუპერ სისწრაფისთვის
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'chantashop.ge' },
      { protocol: 'https', hostname: 'secure.gravatar.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  // ✅ პროდაქშენზე აშორებს ზედმეტ ლოგებს (Console log)
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // ✅ აჩქარებს ლოდინის დროს მძიმე ბიბლიოთეკებისთვის
  experimental: {
    optimizePackageImports: ['lucide-react'],
  }
};

export default withNextIntl(nextConfig);