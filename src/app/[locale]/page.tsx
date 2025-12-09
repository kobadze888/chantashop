import Hero from '@/components/home/Hero';
import Brands from '@/components/home/Brands';
import Categories from '@/components/home/Categories'; // ✅ დარწმუნდი რომ ეს იმპორტი არსებობს
import FeaturedCarousel from '@/components/home/FeaturedCarousel';
import { getProducts } from '@/lib/api';
import { Product } from '@/types';
import { getTranslations } from 'next-intl/server';

function getSecondImage(product: Product): string | null {
  const galleryNodes = product.galleryImages?.nodes;
  if (!galleryNodes) return null;
  let secondImage = galleryNodes[0]?.sourceUrl;
  if (secondImage) return secondImage;
  secondImage = galleryNodes[1]?.sourceUrl;
  if (secondImage) return secondImage;
  secondImage = galleryNodes[2]?.sourceUrl;
  if (secondImage) return secondImage;
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
    slug: p.slug
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