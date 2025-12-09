import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts } from '@/lib/api';
import { Link } from '@/navigation';
import { ChevronRight } from 'lucide-react';
import type { Product } from '@/types';
import ProductInfo from '../_components/ProductInfo'; 
import FeaturedCarousel from '@/components/home/FeaturedCarousel';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);
  if (!product) return {};
  return {
    title: product.seo?.title || product.name,
    description: product.seo?.metaDesc || product.shortDescription,
  };
}

export default async function ProductPage({ params }: Props) {
  const resolvedParams = await params;
  const { slug, locale } = resolvedParams;
  const t = await getTranslations('Common');

  // პარალელურად წამოვიღოთ პროდუქტი და "მსგავსი პროდუქტები"
  const productData = getProductBySlug(slug);
  const relatedProductsData = getProducts({ limit: 8 }, locale);

  const [product, relatedProductsRaw] = await Promise.all([productData, relatedProductsData]);

  if (!product) notFound();

  // მსგავსი პროდუქტების დაფორმატება
  const relatedProducts = relatedProductsRaw
    .filter((p: any) => p.slug !== slug)
    .map((p: any) => ({
      id: p.databaseId,
      name: p.name,
      price: p.salePrice || p.price,
      salePrice: p.salePrice,
      regularPrice: p.regularPrice,
      image: p.image?.sourceUrl || '/placeholder.jpg',
      slug: p.slug
    }));

  return (
    <div className="md:pt-32 pt-24 pb-24 bg-white min-h-screen">
      {/* ✅ შესწორება: max-w-[1600px] -> max-w-[1350px] (უფრო ოპტიმალური ზომა) */}
      <div className="container mx-auto px-6 max-w-[1350px]">
        
        {/* Breadcrumbs */}
        <nav className="text-xs font-bold text-gray-400 mb-10 uppercase tracking-widest flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-2 hide-scrollbar">
            <Link href="/" className="hover:text-brand-dark transition">{t('home')}</Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <Link href="/collection" className="hover:text-brand-dark transition">{t('collection')}</Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <span className="text-brand-dark truncate">{product.name}</span>
        </nav>
        
        {/* მთავარი კომპონენტი */}
        <ProductInfo product={product} locale={locale} />

        {/* მსგავსი პროდუქტები */}
        {relatedProducts.length > 0 && (
            <div className="mt-32 border-t border-gray-100 pt-20">
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