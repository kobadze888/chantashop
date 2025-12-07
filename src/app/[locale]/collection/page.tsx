import { Metadata } from 'next';
import { getProducts, getCategories } from '@/lib/api';
import CatalogClient from '@/components/catalog/CatalogClient';

export const metadata: Metadata = {
  title: 'სრული კატალოგი | ChantaShop',
  description: 'Premium Bags Collection',
};

export default async function CollectionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const [products, categories] = await Promise.all([
    getProducts(50), 
    getCategories()
  ]);

  return (
    <main className="pt-28 md:pt-36 pb-24 min-h-screen bg-white">
      {/* Header logic moved inside CatalogClient */}
      <CatalogClient 
        initialProducts={products} 
        categories={categories} 
        locale={locale} 
      />
    </main>
  );
}