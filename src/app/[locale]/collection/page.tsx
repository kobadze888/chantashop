// src/app/[locale]/collection/page.tsx
import { Metadata } from 'next';
import { getProducts, getFilters } from '@/lib/api';
import CatalogClient from '@/components/catalog/CatalogClient';
import { Product } from '@/types';

export const metadata: Metadata = {
  title: 'სრული კატალოგი | ChantaShop',
  description: 'Premium Bags Collection',
};

export default async function CollectionPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ locale: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;

  // URL-დან პარამეტრების ამოღება
  const category = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : 'all';
  const color = typeof resolvedSearchParams.color === 'string' ? resolvedSearchParams.color : 'all';
  const material = typeof resolvedSearchParams.material === 'string' ? resolvedSearchParams.material : 'all';
  const maxPrice = typeof resolvedSearchParams.maxPrice === 'string' ? parseInt(resolvedSearchParams.maxPrice) : 5000;
  // ✅ დაემატა sort პარამეტრის ამოღება
  const sort = typeof resolvedSearchParams.sort === 'string' ? resolvedSearchParams.sort : 'DATE_DESC';

  // API მოთხოვნა (Server-Side Filtering)
  const [productsRaw, filters] = await Promise.all([
    getProducts({ 
      category: category !== 'all' ? category : undefined,
      color: color !== 'all' ? color : undefined,
      material: material !== 'all' ? material : undefined,
      maxPrice: maxPrice < 5000 ? maxPrice : undefined,
      limit: 100,
      sort: sort as any // ✅ sort-ის გადაცემა
    }, locale), 
    getFilters()
  ]);

  const targetLang = locale.toUpperCase();

  // ენის ფილტრაცია (Safety Check)
  const products = productsRaw.filter((p: Product) => {
    const prodLang = p.language?.code;
    return !prodLang || prodLang === targetLang;
  });

  const filterByLang = (item: any) => 
    !item.safeLanguage || item.safeLanguage === "" || item.safeLanguage === targetLang;

  return (
    <main className="pt-28 md:pt-36 pb-24 min-h-screen bg-white">
      <CatalogClient 
        initialProducts={products} 
        categories={filters.categories.filter(filterByLang)}
        colors={filters.colors.filter(filterByLang)}
        sizes={filters.sizes.filter(filterByLang)}
        locale={locale} 
      />
    </main>
  );
}