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

  // 1. ვიღებთ ამ ენის პროდუქტებს (1000 ცალს) და ყველა ფილტრს
  const [products, filters] = await Promise.all([
    getProducts(1000, locale), 
    getFilters()
  ]);

  const targetLang = locale.toUpperCase();

  // 2. ვფილტრავთ კატეგორიებს ენის მიხედვით (რომ ინგლისური არ გამოჩნდეს ქართულზე და პირიქით)
  // ასევე ვტოვებთ "ნეიტრალურ" (ენის გარეშე) კატეგორიებს, როგორიცაა YSL, Gucci
  const filterByLang = (item: any) => 
    !item.safeLanguage || item.safeLanguage === "" || item.safeLanguage === targetLang;

  const filteredCategories = filters.categories.filter(filterByLang);
  const filteredColors = filters.colors.filter(filterByLang);
  const filteredSizes = filters.sizes.filter(filterByLang);

  return (
    <main className="pt-28 md:pt-36 pb-24 min-h-screen bg-white">
      <CatalogClient 
        initialProducts={products} 
        categories={filteredCategories}
        colors={filteredColors}
        sizes={filteredSizes}
        locale={locale} 
      />
    </main>
  );
}