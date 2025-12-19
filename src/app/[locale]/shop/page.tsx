// src/app/[locale]/shop/page.tsx
import { Metadata } from 'next';
import { getProducts, getFilters, getPageBySlugReal } from '@/lib/api';
import CatalogClient from '@/components/catalog/CatalogClient';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const wpSlugs: Record<string, string> = {
  ka: 'shop',
  en: 'shop-3',
  ru: 'shop-2'
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const slugToFetch = wpSlugs[locale] || 'shop';
  const pageData = await getPageBySlugReal(slugToFetch);

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

  return {
    title: 'მაღაზია | ChantaShop',
    description: 'საუკეთესო ჩანთები და აქსესუარები.',
  };
}

export default async function ShopPage({ 
  params, 
  searchParams 
}: Props) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;

  const category = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : 'all';
  const minPrice = typeof resolvedSearchParams.minPrice === 'string' ? Number(resolvedSearchParams.minPrice) : undefined;
  const maxPrice = typeof resolvedSearchParams.maxPrice === 'string' ? Number(resolvedSearchParams.maxPrice) : undefined;
  const sort = typeof resolvedSearchParams.sort === 'string' ? resolvedSearchParams.sort : 'DATE_DESC';

  const dynamicAttributes: Record<string, string> = {};
  
  Object.keys(resolvedSearchParams).forEach(key => {
      if (key.startsWith('pa_') || key === 'color' || key === 'material') {
          const val = resolvedSearchParams[key];
          if (typeof val === 'string' && val !== 'all') {
              const taxName = key === 'color' ? 'pa_color' : (key === 'material' ? 'pa_masala' : key);
              dynamicAttributes[taxName] = val;
          }
      }
  });

  const [productsRaw, filters] = await Promise.all([
    getProducts({ 
      category: category !== 'all' ? category : undefined,
      minPrice,
      maxPrice,
      limit: 100,
      sort: sort as any,
      dynamicAttributes 
    }, locale), 
    getFilters(locale) // ✅ ვაწვდით ენას
  ]);

  const products = productsRaw || [];
  const attributes = filters?.attributes || []; 

  return (
    <main className="pt-28 md:pt-36 pb-24 min-h-screen bg-white">
      <CatalogClient 
        initialProducts={products} 
        categories={filters?.categories || []}
        attributes={attributes}
        locale={locale} 
      />
    </main>
  );
}