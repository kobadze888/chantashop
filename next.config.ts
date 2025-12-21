import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

// სერვერისთვის SSL-ის პრობლემის მოგვარება
if (process.env.NODE_ENV === 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  compress: true, 
  images: {
    formats: ['image/avif', 'image/webp'], 
    minimumCacheTTL: 31536000, 
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // ✅ დაუშვი ნებისმიერი დომენი
      },
      {
        protocol: 'http',
        hostname: '**', // ✅ http-ს დაშვებაც აუცილებელია
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'clsx', 'tailwind-merge', 'zustand'],
  }
};

export default withNextIntl(nextConfig);