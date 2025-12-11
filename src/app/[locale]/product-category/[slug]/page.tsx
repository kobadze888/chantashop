import { Metadata } from 'next';
import { getProducts, getFilters } from '@/lib/api';
import CatalogClient from '@/components/catalog/CatalogClient';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `კატეგორია: ${slug} | ChantaShop`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  const resolvedSearchParams = await searchParams;

  const minPrice = typeof resolvedSearchParams.minPrice === 'string' ? Number(resolvedSearchParams.minPrice) : undefined;
  const maxPrice = typeof resolvedSearchParams.maxPrice === 'string' ? Number(resolvedSearchParams.maxPrice) : undefined;
  const sort = typeof resolvedSearchParams.sort === 'string' ? resolvedSearchParams.sort : 'DATE_DESC';

  const [products, filters] = await Promise.all([
    getProducts({ 
      category: slug, 
      minPrice,
      maxPrice,
      limit: 100,
      sort: sort as any
    }, locale), 
    getFilters()
  ]);

  if (!products) {
     notFound();
  }

  // ✅ FIX: უსაფრთხო ფილტრები
  const safeFilters = filters || { categories: [], colors: [], sizes: [] };

  return (
    <main className="pt-28 md:pt-36 pb-24 min-h-screen bg-white">
      <CatalogClient 
        initialProducts={products} 
        categories={safeFilters.categories}
        colors={safeFilters.colors}
        sizes={safeFilters.sizes}
        locale={locale} 
      />
    </main>
  );
}