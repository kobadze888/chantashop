import { Metadata } from 'next';
import { getProducts, getFilters } from '@/lib/api';
import CatalogClient from '@/components/catalog/CatalogClient';
import { Product, FilterTerm } from '@/types';

export const metadata: Metadata = {
  title: 'სრული კატალოგი | ChantaShop',
  description: 'Premium Bags Collection',
};

// Next.js 15+ მოითხოვს Promise ტიპებს
type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CollectionPage({ 
  params, 
  searchParams 
}: Props) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;

  // URL-დან პარამეტრების ამოღება და ტიპიზაცია
  const category = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : 'all';
  const color = typeof resolvedSearchParams.color === 'string' ? resolvedSearchParams.color : 'all';
  const material = typeof resolvedSearchParams.material === 'string' ? resolvedSearchParams.material : 'all';
  
  // ფასის კონვერტაცია (string -> number)
  const minPrice = typeof resolvedSearchParams.minPrice === 'string' ? Number(resolvedSearchParams.minPrice) : undefined;
  const maxPrice = typeof resolvedSearchParams.maxPrice === 'string' ? Number(resolvedSearchParams.maxPrice) : undefined;
  
  const sort = typeof resolvedSearchParams.sort === 'string' ? resolvedSearchParams.sort : 'DATE_DESC';

  // API მოთხოვნა (Server-Side Filtering)
  const [productsRaw, filters] = await Promise.all([
    getProducts({ 
      category: category !== 'all' ? category : undefined,
      color: color !== 'all' ? color : undefined,
      material: material !== 'all' ? material : undefined,
      minPrice,
      maxPrice,
      limit: 100,
      sort: sort as any 
    }, locale), 
    getFilters()
  ]);

  const targetLang = locale.toUpperCase();

  // ენის ფილტრაცია (Safety Check)
  const products = (productsRaw || []).filter((p: Product) => {
    const prodLang = p.language?.code;
    return !prodLang || prodLang === targetLang;
  });

  // ✅ FIX: უსაფრთხო ფილტრები (Null Check)
  const safeFilters = filters || { categories: [], colors: [], sizes: [] };

  // ფილტრების გაფილტვრა ენის მიხედვით
  const filterByLang = (item: FilterTerm) => 
    !item.safeLanguage || item.safeLanguage === "" || item.safeLanguage === targetLang;

  return (
    <main className="pt-28 md:pt-36 pb-24 min-h-screen bg-white">
      <CatalogClient 
        initialProducts={products} 
        categories={safeFilters.categories.filter(filterByLang)}
        colors={safeFilters.colors.filter(filterByLang)}
        sizes={safeFilters.sizes.filter(filterByLang)}
        locale={locale} 
      />
    </main>
  );
}