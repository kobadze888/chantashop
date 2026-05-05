import { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import PromoStrip from '@/components/home/PromoStrip';
import CategoriesGrid from '@/components/home/CategoriesGrid';
import NewArrivals from '@/components/home/NewArrivals';
import EditorialBanner from '@/components/home/EditorialBanner';
import BestSellers from '@/components/home/BestSellers';
import SaleSection from '@/components/home/SaleSection';
import Brands from '@/components/home/Brands';
import Newsletter from '@/components/home/Newsletter';
import { getHomeData, getPageByUri } from '@/lib/api';
import type { Product } from '@/types';

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  default: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop',
  luqsi: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=800&auto=format&fit=crop',
  ekonomi: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
  qalis_chantebi: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=800&auto=format&fit=crop',
  'naturaluri-tyavis-chantebi': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
  kolgebi: 'https://images.unsplash.com/photo-1601379329542-31c59ba1716b?q=80&w=800&auto=format&fit=crop',
};

const getSecondImage = (p: Product): string | undefined => p.galleryImages?.nodes?.[0]?.sourceUrl;

const formatProduct = (p: Product) => ({
  id: p.databaseId,
  name: p.name,
  price: p.price,
  salePrice: p.salePrice,
  regularPrice: p.regularPrice,
  image: p.image?.sourceUrl || '/placeholder.jpg',
  secondImage: getSecondImage(p),
  slug: p.slug,
  stockQuantity: p.stockQuantity,
  stockStatus: p.stockStatus,
  stockStatusManual: p.stockStatusManual,
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const uri = locale === 'ka' ? '/' : `/${locale}/`;
  const pageData = await getPageByUri(uri);

  if (pageData?.seo) {
    return {
      title: pageData.seo.title,
      description: pageData.seo.metaDesc,
      openGraph: {
        title: pageData.seo.opengraphTitle || pageData.seo.title,
        description: pageData.seo.opengraphDescription || pageData.seo.metaDesc,
        images: pageData.seo.opengraphImage?.sourceUrl ? [pageData.seo.opengraphImage.sourceUrl] : [],
        locale,
        type: 'website',
      },
    };
  }

  return { title: 'ChantaShop - Iconic Luxury' };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const data = await getHomeData(locale);

  const newArrivals = data.newArrivals.map(formatProduct);
  const onSale = data.onSale.map(formatProduct);
  const bestSellers = data.bestSellers.map(formatProduct);

  // Fallback: if no best sellers from WP, use the first 4 of new arrivals so the grid isn't empty.
  const bestSellersOrFallback = bestSellers.length ? bestSellers : newArrivals.slice(0, 4);

  return (
    <main className="min-h-screen bg-white pb-10 md:pb-16">
      <Hero />
      <PromoStrip />
      <CategoriesGrid categories={data.categories} fallbackImages={CATEGORY_FALLBACK_IMAGES} />
      <NewArrivals products={newArrivals} locale={locale} />
      <EditorialBanner />
      <BestSellers products={bestSellersOrFallback} locale={locale} />
      {onSale.length > 0 && <SaleSection products={onSale} locale={locale} />}
      <Brands />
      <Newsletter />
    </main>
  );
}
