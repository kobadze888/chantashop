// src/app/[locale]/collection/page.tsx

import { Metadata } from 'next';
import { getProducts, getFilters } from '@/lib/api';
import CatalogClient from '@/components/catalog/CatalogClient';

export const metadata: Metadata = {
  title: 'სრული კატალოგი | ChantaShop',
  description: 'Premium Bags Collection',
};

export default async function CollectionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const [products, filters] = await Promise.all([
    getProducts(50, locale), 
    getFilters()
  ]);

  const targetLang = locale.toUpperCase();

  // ენის ფილტრაცია safeLanguage-ით
  const filteredCategories = filters.categories.filter((c: any) => c.safeLanguage === targetLang);
  const filteredColors = filters.colors.filter((c: any) => c.safeLanguage === targetLang);
  const filteredSizes = filters.sizes.filter((c: any) => c.safeLanguage === targetLang); // ეს სინამდვილეში მასალებია

  return (
    <main className="pt-28 md:pt-36 pb-24 min-h-screen bg-white">
      <CatalogClient 
        initialProducts={products} 
        categories={filteredCategories}
        colors={filteredColors}
        sizes={filteredSizes} // გადავცემთ მასალებს ზომების ადგილას
        locale={locale} 
      />
    </main>
  );
}