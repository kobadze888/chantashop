// src/app/[locale]/product-category/[slug]/page.tsx
import { Metadata } from 'next';
import { getProducts, getFilters } from '@/lib/api';
import CatalogClient from '@/components/catalog/CatalogClient';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `კატეგორია: ${slug} | ChantaShop`,
  };
}

export default async function CategoryPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ locale: string, slug: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const { locale, slug } = await params;
  const resolvedSearchParams = await searchParams;

  // ვიღებთ დანარჩენ ფილტრებსაც URL-დან
  const color = typeof resolvedSearchParams.color === 'string' ? resolvedSearchParams.color : 'all';
  const material = typeof resolvedSearchParams.material === 'string' ? resolvedSearchParams.material : 'all';
  const maxPrice = typeof resolvedSearchParams.maxPrice === 'string' ? parseInt(resolvedSearchParams.maxPrice) : 5000;
  const sort = typeof resolvedSearchParams.sort === 'string' ? resolvedSearchParams.sort : 'DATE_DESC';

  // ვიძახებთ პროდუქტებს კონკრეტული კატეგორიით (slug)
  const [products, filters] = await Promise.all([
    getProducts({ 
      category: slug, // <-- აქ გადავცემთ URL-ის სლაგს
      color: color !== 'all' ? color : undefined,
      material: material !== 'all' ? material : undefined,
      maxPrice: maxPrice < 5000 ? maxPrice : undefined,
      limit: 100,
      sort: sort as any
    }, locale), 
    getFilters()
  ]);

  if (!products && !filters) {
     notFound();
  }

  return (
    <main className="pt-28 md:pt-36 pb-24 min-h-screen bg-white">
      <CatalogClient 
        initialProducts={products} 
        categories={filters.categories}
        colors={filters.colors}
        sizes={filters.sizes}
        locale={locale} 
      />
    </main>
  );
}