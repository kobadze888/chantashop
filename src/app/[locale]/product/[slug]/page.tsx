import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/api';
import { Link } from '@/navigation';
import { ChevronRight } from 'lucide-react';
import type { Product } from '@/types';
import ProductInfo from '../_components/ProductInfo'; 
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
  const product = (await getProductBySlug(slug)) as Product | null;
  const t = await getTranslations('Common');

  if (!product) notFound();

  return (
    <div className="md:pt-32 pt-20 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-4">
        
        <div className="text-xs text-gray-400 mb-8 font-bold flex items-center gap-2 uppercase tracking-wide">
            <Link href="/" className="cursor-pointer hover:text-brand-DEFAULT transition">
                {t('home')}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/collection" className="cursor-pointer hover:text-brand-DEFAULT transition">
                {t('collection')}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-brand-dark truncate max-w-xs">{product.name}</span>
        </div>
        
        <ProductInfo product={product} />
      </div>
    </div>
  );
}