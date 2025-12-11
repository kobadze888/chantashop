import { MetadataRoute } from 'next';
import { getProducts, getFilters } from '@/lib/api';
import { FilterTerm, Product } from '@/types'; // ✅ ტიპების იმპორტი

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://chantashop.ge';
const locales = ['ka', 'en', 'ru'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts({ limit: 1000, sort: 'DATE_DESC' }, 'ka') || [];
  const filters = await getFilters() || { categories: [], colors: [], sizes: [] };

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 1. სტატიკური გვერდები
  const staticPages = ['', '/collection', '/brands', '/sale'];

  staticPages.forEach((route) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: route === '' ? 1 : 0.8,
      });
    });
  });

  // 2. პროდუქტები
  if (products.length > 0) {
    products.forEach((product: Product) => { // ✅ ტიპი
      locales.forEach((locale) => {
        sitemapEntries.push({
          url: `${baseUrl}/${locale}/product/${product.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.9,
        });
      });
    });
  }

  // 3. კატეგორიები
  if (filters.categories.length > 0) {
    filters.categories.forEach((cat: FilterTerm) => { // ✅ ტიპი
      locales.forEach((locale) => {
        sitemapEntries.push({
          url: `${baseUrl}/${locale}/product-category/${cat.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      });
    });
  }

  // 4. ფერები
  if (filters.colors.length > 0) {
    filters.colors.forEach((color: FilterTerm) => { // ✅ ტიპი
      locales.forEach((locale) => {
        sitemapEntries.push({
          url: `${baseUrl}/${locale}/color/${color.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.6,
        });
      });
    });
  }

  return sitemapEntries;
}