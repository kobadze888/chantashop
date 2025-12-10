import Hero from '@/components/home/Hero';
import Brands from '@/components/home/Brands';
import Categories from '@/components/home/Categories';
import FeaturedCarousel from '@/components/home/FeaturedCarousel';
import { getProducts } from '@/lib/api';
import { Product } from '@/types';
import { getTranslations } from 'next-intl/server';

function getSecondImage(product: Product): string | null {
  const galleryNodes = product.galleryImages?.nodes;
  // ✅ კორექტირება: ვინაიდან GraphQL-ში ვითხოვთ galleryImages(first: 1)-ს, 
  // მეორე სურათი არის გალერეის პირველი (ანუ nodes[0])
  if (galleryNodes && galleryNodes.length > 0) {
      return galleryNodes[0]?.sourceUrl || null;
  }
  return null;
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('Home.Featured');
  
  const products = await getProducts({ limit: 8 }, locale) || [];

  const formattedProducts = products.map((p: any) => ({
    id: p.databaseId,
    name: p.name,
    price: p.salePrice || p.price,
    salePrice: p.salePrice,
    regularPrice: p.regularPrice,
    image: p.image?.sourceUrl || '/placeholder.jpg',
    secondImage: getSecondImage(p),
    slug: p.slug,
    stockQuantity: p.stockQuantity,
    stockStatus: p.stockStatus,
  }));

  return (
    <div className="min-h-screen bg-white">
      <Hero /> 
      <Brands />
      <Categories /> 
      <FeaturedCarousel 
        title={t('title')}
        subtitle={t('subtitle')}
        products={formattedProducts}
        locale={locale}
      />
    </div>
  );
}