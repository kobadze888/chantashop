// next.config.ts
import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  images: {
    // ✅ AVIF ამოღებულია CPU-ს დაზოგვისთვის, დატოვებულია WebP
    formats: ['image/webp'],
    // ✅ სურათების ქეშირება 1 წლით
    minimumCacheTTL: 31536000, 
    remotePatterns: [
      { protocol: 'https', hostname: 'api.chantashop.ge' },
      { protocol: 'https', hostname: 'chantashop.ge' },
      { protocol: 'https', hostname: 'secure.gravatar.com' },
    ],
  },
  // ✅ Console log-ების წაშლა პროდაქშენზე
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // ✅ მძიმე ბიბლიოთეკების ოპტიმიზაცია
  experimental: {
    optimizePackageImports: ['lucide-react'],
  }
};

export default withNextIntl(nextConfig);