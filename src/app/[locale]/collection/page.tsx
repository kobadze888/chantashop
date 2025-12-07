// src/app/[locale]/collection/page.tsx
import { Metadata } from 'next';
import { getProducts, getCategories } from '@/lib/api';
import CatalogClient from '@/components/catalog/CatalogClient';

export const metadata: Metadata = {
  title: 'სრული კატალოგი | ChantaShop',
  description: 'Premium Bags Collection',
};

export default async function CollectionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // ვიღებთ ყველაფერს და ვფილტრავთ აქ
  const [allProducts, allCategories] = await Promise.all([
    getProducts(100), 
    getCategories()
  ]);

  const filteredProducts = allProducts.filter((p: any) => 
    p.language?.code === locale.toUpperCase()
  );

  const filteredCategories = allCategories.filter((c: any) => 
    // კატეგორიებს language ველი თუ არ აქვს query-ში, ფილტრაცია არ იმუშავებს, 
    // ამიტომ უსაფრთხოებისთვის ვაბრუნებთ ყველას ან ვამატებთ ველს query-ში.
    // ამ ეტაპზე დავაბრუნოთ ყველა, რომ არ გაქრეს.
    true 
  );

  return (
    <main className="pt-28 md:pt-36 pb-24 min-h-screen bg-white">
      <CatalogClient 
        initialProducts={filteredProducts} 
        categories={filteredCategories} 
        locale={locale} 
      />
    </main>
  );
}