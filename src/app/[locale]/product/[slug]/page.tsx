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

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

const getLocalizedProductUrl = (locale: string, slug: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://chantashop.ge';
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
      ka: getLocalizedProductUrl('ka', getSlugForLang('ka')),
      en: getLocalizedProductUrl('en', getSlugForLang('en')),
      ru: getLocalizedProductUrl('ru', getSlugForLang('ru')),
    };

    return {
      title: title,
      description: desc,
      alternates: {
        canonical: product.seo?.canonical || languages[locale],
        languages: languages,
      },
      openGraph: {
        title: product.seo?.opengraphTitle || title,
        description: product.seo?.opengraphDescription || desc,
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

  // ✅ უსაფრთხო SEO Redirect (Infinite Loop-ის საწინააღმდეგო მექანიზმი)
  const currentLang = locale.toUpperCase();
  const productLang = product.language?.code?.toUpperCase();

  // ვამოწმებთ, რომ პროდუქტის ენა და URL-ის ენა განსხვავებულია
  if (productLang && productLang !== currentLang) {
      // ვეძებთ თარგმანს მიმდინარე ენისთვის
      const translation = product.availableTranslations?.find(t => t.lang === currentLang);
      
      // 🛑 რედირექტს ვაკეთებთ მხოლოდ მაშინ, თუ:
      // 1. თარგმანი ფიზიკურად არსებობს (translation !== undefined)
      // 2. თარგმანის slug განსხვავებულია მიმდინარე slug-ისგან (ციკლის თავიდან ასაცილებლად)
      if (translation && translation.slug !== slug) {
          redirect(`/${locale}/product/${translation.slug}`);
      }
      
      // თუ თარგმანი არ არსებობს, რედირექტი აღარ მოხდება და გვერდი უბრალოდ ჩაიტვირთება 
      // იმ ენაზე, რომელიც ხელმისაწვდომია (რაც თავიდან აგაცილებს გაჭედვას/loading loop-ს).
  }

  const priceNumeric = parseFloat(product.price?.replace(/[^0-9.]/g, '') || '0');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image?.sourceUrl ? [product.image.sourceUrl] : [],
    description: product.seo?.metaDesc || product.shortDescription?.replace(/<[^>]*>?/gm, '') || product.name,
    sku: product.sku || `ART-${product.databaseId}`,
    brand: { '@type': 'Brand', name: 'ChantaShop' },
    offers: {
      '@type': 'Offer',
      url: getLocalizedProductUrl(locale, product.slug),
      priceCurrency: 'GEL',
      price: priceNumeric,
      availability: product.stockStatusManual === 'instock' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', value: priceNumeric >= 200 ? 0 : 6, currency: 'GEL' },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
          transitTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 2, unitCode: 'DAY' },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'GE',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnPeriod',
        merchantReturnDays: 14,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
    },
  };

  const categorySlug = product.productCategories?.nodes?.[0]?.slug;
  const relatedProductsRaw = await getProducts({ limit: 8, category: categorySlug }, locale) || [];

  const relatedProducts = relatedProductsRaw
    .filter((p: any) => p && p.slug !== product.slug)
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
                <FeaturedCarousel 
                  title={t.has('relatedProducts') ? t('relatedProducts') : "მსგავსი პროდუქტები"} 
                  products={relatedProducts} 
                  locale={locale} 
                />
            </div>
        )}
      </div>
    </div>
  );
}