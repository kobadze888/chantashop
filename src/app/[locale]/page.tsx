// src/app/[locale]/page.tsx
import { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import Brands from '@/components/home/Brands';
import Categories from '@/components/home/Categories';
import FeaturedCarousel from '@/components/home/FeaturedCarousel';
import { getProducts, getPageByUri } from '@/lib/api';
import { Product } from '@/types';
import { getTranslations } from 'next-intl/server';

function getSecondImage(product: Product): string | null {
  const galleryNodes = product.galleryImages?.nodes;
  if (!galleryNodes) return null;
  return galleryNodes[0]?.sourceUrl || null;
}

// ✅ მთავარი გვერდის დინამიური SEO
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  
  // განსაზღვრეთ URI
  // ქართულისთვის (ka) - '/', ინგლისურისთვის (en) - '/en/'
  const uri = locale === 'ka' ? '/' : `/${locale}/`;
  
  // მონაცემების წამოღება
  const pageData = await getPageByUri(uri);

  if (pageData?.seo) {
    return {
      title: pageData.seo.title,
      description: pageData.seo.metaDesc,
      openGraph: {
        title: pageData.seo.opengraphTitle || pageData.seo.title,
        description: pageData.seo.opengraphDescription || pageData.seo.metaDesc,
        images: pageData.seo.opengraphImage?.sourceUrl ? [pageData.seo.opengraphImage.sourceUrl] : [],
        locale: locale,
        type: 'website',
      }
    };
  }

  // Fallback (თუ WP-ში მთავარი გვერდი ვერ იპოვა)
  return { title: 'ChantaShop - Iconic Luxury' };
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