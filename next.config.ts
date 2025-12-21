import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  compress: true, 
  images: {
    formats: ['image/webp'], 
    minimumCacheTTL: 31536000, 
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.chantashop.ge',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
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
  // ✅ eslint: { ignoreDuringBuilds: true } ამოღებულია და გადატანილია სწორ ფორმატში, თუ მაინც გჭირდება.
  // თუმცა Next.js 15+ ში ის ავტომატურად მართვადია.
  experimental: {
    optimizePackageImports: ['lucide-react', 'clsx', 'tailwind-merge', 'zustand'],
  }
};

export default withNextIntl(nextConfig);