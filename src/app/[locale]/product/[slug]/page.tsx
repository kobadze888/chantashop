import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts } from '@/lib/api';
import { Link } from '@/navigation';
import { ChevronRight } from 'lucide-react';
import ProductInfo from '../_components/ProductInfo'; 
import FeaturedCarousel from '@/components/home/FeaturedCarousel';
import { getTranslations } from 'next-intl/server';
import Script from 'next/script';

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

// 1. SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);
  
  if (!product) return { title: 'პროდუქტი არ მოიძებნა' };

  return {
    title: product.seo?.title || product.name,
    description: product.seo?.metaDesc || product.shortDescription?.replace(/<[^>]*>?/gm, '').slice(0, 160),
    openGraph: {
      images: [product.image?.sourceUrl || '/placeholder.jpg'],
    },
  };
}

// 2. გვერდი
export default async function ProductPage({ params }: Props) {
  const resolvedParams = await params;
  const { slug, locale } = resolvedParams;
  const t = await getTranslations('Common');

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  // მსგავსი პროდუქტები
  const categorySlug = product.productCategories?.nodes[0]?.slug;
  const relatedProductsRaw = await getProducts({ limit: 8, category: categorySlug }, locale) || [];

  const relatedProducts = relatedProductsRaw
    .filter((p: any) => p.slug !== slug)
    .map((p: any) => ({
      id: p.databaseId,
      name: p.name,
      price: p.salePrice || p.price,
      salePrice: p.salePrice,
      regularPrice: p.regularPrice,
      image: p.image?.sourceUrl || '/placeholder.jpg',
      slug: p.slug,
      stockQuantity: p.stockQuantity,
      stockStatus: p.stockStatus
    }));

  // ✅ JSON-LD სქემა (მარაგის გარეშე)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image?.sourceUrl ? [product.image.sourceUrl] : [],
    description: product.shortDescription?.replace(/<[^>]*>?/gm, '') || product.name,
    sku: product.databaseId,
    offers: {
      '@type': 'Offer',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/product/${slug}`,
      priceCurrency: 'GEL',
      price: parseFloat(product.price?.replace(/[^0-9.]/g, '') || '0'),
      // availability ველი წაშლილია განზრახ
    },
  };

  return (
    <div className="md:pt-32 pt-24 pb-24 bg-white min-h-screen">
      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-6 max-w-[1350px]">
        <nav className="text-xs font-bold text-gray-400 mb-10 uppercase tracking-widest flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-2 hide-scrollbar">
            <Link href="/" className="hover:text-brand-dark transition">{t('home')}</Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <Link href="/collection" className="hover:text-brand-dark transition">{t('collection')}</Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <span className="text-brand-dark truncate">{product.name}</span>
        </nav>
        
        <ProductInfo product={product} locale={locale} />

        {relatedProducts.length > 0 && (
            <div className="mt-8 border-t border-gray-100 pt-8">
                <FeaturedCarousel 
                    title="შეიძლება მოგეწონოთ"
                    subtitle="მსგავსი სტილი"
                    products={relatedProducts}
                    locale={locale}
                />
            </div>
        )}
      </div>
    </div>
  );
}