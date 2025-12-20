import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://chantashop.ge';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/checkout/', '/cart/', '/account/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}