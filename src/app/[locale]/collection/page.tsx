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
    getProducts(100, locale), // გავზარდოთ ლიმიტი რომ მეტი პროდუქტი გამოჩნდეს
    getFilters()
  ]);

  const targetLang = locale.toUpperCase();

  // ✅ შესწორებული ლოგიკა: 
  // ვაჩვენებთ კატეგორიას თუ: 
  // 1. ენა ემთხვევა (KA === KA)
  // 2. ან ენა საერთოდ არ აქვს მითითებული (მაგ. Gucci, Guess)
  const filteredCategories = filters.categories.filter((c: any) => 
    !c.safeLanguage || c.safeLanguage === "" || c.safeLanguage === targetLang
  );

  const filteredColors = filters.colors.filter((c: any) => 
    !c.safeLanguage || c.safeLanguage === "" || c.safeLanguage === targetLang
  );

  const filteredSizes = filters.sizes.filter((c: any) => 
    !c.safeLanguage || c.safeLanguage === "" || c.safeLanguage === targetLang
  );

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