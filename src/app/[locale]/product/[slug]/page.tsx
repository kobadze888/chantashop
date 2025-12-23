// src/app/[locale]/product/[slug]/page.tsx
import { getProductBySlug, getProducts } from '@/lib/api';
import { Link } from '@/navigation';
import { ChevronRight } from 'lucide-react';
import ProductInfo from '../_components/ProductInfo'; 
import FeaturedCarousel from '@/components/home/FeaturedCarousel';
import { getTranslations } from 'next-intl/server';
import Script from 'next/script';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

type Props = { params: Promise<{ slug: string; locale: string }>; };

const getLocalizedProductUrl = (locale: string, slug: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const prefix = locale === 'ka' ? '' : `/${locale}`;
  return `${baseUrl}${prefix}/product/${slug}`;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, locale } = await params;
    const product = await getProductBySlug(slug, locale);
    if (!product) return { title: 'პროდუქტი არ მოიძებნა' };
  
    const title = product.seo?.title || `${product.name} | ChantaShop`;
    const desc = product.seo?.metaDesc || product.shortDescription?.replace(/<[^>]*>?/gm, '').slice(0, 160);

    const getSlugForLang = (targetLang: string) => {
        const target = targetLang.toUpperCase();
        if (product.availableTranslations) {
            const translation = product.availableTranslations.find(t => t.lang === target);
            if (translation) return translation.slug;
        }
        return product.slug;
    };

    const languages: Record<string, string> = {
      ka: getLocalizedProductUrl('ka', getSlugForLang('KA')),
      en: getLocalizedProductUrl('en', getSlugForLang('EN')),
      ru: getLocalizedProductUrl('ru', getSlugForLang('RU')),
    };

    return {
      title, description: desc,
      alternates: { canonical: languages[locale], languages },
      openGraph: {
        title, description: desc,
        images: [product.seo?.opengraphImage?.sourceUrl || product.image?.sourceUrl || '/placeholder.jpg'],
        type: 'website',
      },
    };
}

export default async function ProductPage({ params }: Props) {
  const { slug, locale } = await params;
  const t = await getTranslations('Common');
  
  const product = await getProductBySlug(slug, locale);
  if (!product) notFound();

  // ✅ ავტომატური რედირექტი: თუ მიმდინარე სლაგი არ ეკუთვნის ამ ენას
  const currentLang = locale.toUpperCase();
  if (product.language?.code && product.language.code !== currentLang) {
      const correctTranslation = product.availableTranslations?.find(t => t.lang === currentLang);
      if (correctTranslation) {
          redirect(`/${locale}/product/${correctTranslation.slug}`);
      }
  }

  const categorySlug = product.productCategories?.nodes?.[0]?.slug;
  const relatedProductsRaw = await getProducts({ limit: 8, category: categorySlug }, locale) || [];

  const relatedProducts = relatedProductsRaw
    .filter((p: any) => p && p.slug !== product.slug)
    .map((p: any) => ({
      id: p.databaseId, name: p.name, price: p.salePrice || p.price, salePrice: p.salePrice, regularPrice: p.regularPrice,
      image: p.image?.sourceUrl || '/placeholder.jpg', slug: p.slug, stockQuantity: p.stockQuantity, stockStatus: p.stockStatus
    }));

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Product', name: product.name,
    image: product.image?.sourceUrl ? [product.image.sourceUrl] : [],
    offers: {
      '@type': 'Offer', url: getLocalizedProductUrl(locale, product.slug), priceCurrency: 'GEL',
      price: parseFloat(product.price?.replace(/[^0-9.]/g, '') || '0'),
    },
  };

  return (
    <div className="md:pt-32 pt-24 pb-24 bg-white min-h-screen">
      <Script id="product-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container mx-auto px-6 max-w-[1350px]">
        <nav className="text-xs font-bold text-gray-400 mb-10 uppercase tracking-widest flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-2 hide-scrollbar">
            <Link href="/" className="hover:text-brand-dark transition">{t('home')}</Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <Link href="/shop" className="hover:text-brand-dark transition">{t('collection')}</Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <span className="text-brand-dark truncate">{product.name}</span>
        </nav>
        <ProductInfo product={product} locale={locale} />
        {relatedProducts.length > 0 && (
            <div className="mt-8 border-t border-gray-100 pt-8">
                <FeaturedCarousel title={t.has('relatedProducts') ? t('relatedProducts') : "მსგავსი პროდუქტები"} products={relatedProducts} locale={locale} />
            </div>
        )}
      </div>
    </div>
  );
}