// src/app/[locale]/shop/page.tsx
import { Metadata } from 'next';
import { getProducts, getFilters, getPageByUri } from '@/lib/api';
import CatalogClient from '@/components/catalog/CatalogClient';
import { FilterTerm } from '@/types';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// ✅ Shop გვერდის SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  
  // ka -> '/shop/', en -> '/en/shop/'
  const uri = locale === 'ka' ? '/shop/' : `/${locale}/shop/`;
  const pageData = await getPageByUri(uri);

  const title = pageData?.seo?.title || 'მაღაზია | ChantaShop';
  const desc = pageData?.seo?.metaDesc || 'საუკეთესო ჩანთები და აქსესუარები.';

  return {
    title: title,
    description: desc,
    openGraph: {
      title: pageData?.seo?.opengraphTitle || title,
      description: pageData?.seo?.opengraphDescription || desc,
      images: pageData?.seo?.opengraphImage?.sourceUrl ? [pageData.seo.opengraphImage.sourceUrl] : [],
      locale: locale,
      type: 'website',
    }
  };
}

export default async function ShopPage({ 
  params, 
  searchParams 
}: Props) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;

  const category = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : 'all';
  const color = typeof resolvedSearchParams.color === 'string' ? resolvedSearchParams.color : 'all';
  const material = typeof resolvedSearchParams.material === 'string' ? resolvedSearchParams.material : 'all';
  
  const minPrice = typeof resolvedSearchParams.minPrice === 'string' ? Number(resolvedSearchParams.minPrice) : undefined;
  const maxPrice = typeof resolvedSearchParams.maxPrice === 'string' ? Number(resolvedSearchParams.maxPrice) : undefined;
  const sort = typeof resolvedSearchParams.sort === 'string' ? resolvedSearchParams.sort : 'DATE_DESC';

  // API მოთხოვნა
  const [productsRaw, filters] = await Promise.all([
    getProducts({ 
      category: category !== 'all' ? category : undefined,
      color: color !== 'all' ? color : undefined,
      material: material !== 'all' ? material : undefined,
      minPrice,
      maxPrice,
      limit: 100,
      sort: sort as any 
    }, locale), 
    getFilters()
  ]);

  const products = productsRaw || [];
  const safeFilters = filters || { categories: [], colors: [], sizes: [] };

  const targetLang = locale.toUpperCase();
  const filterByLang = (item: FilterTerm) => 
    !item.safeLanguage || item.safeLanguage === "" || item.safeLanguage === targetLang;

  return (
    <main className="pt-28 md:pt-36 pb-24 min-h-screen bg-white">
      <CatalogClient 
        initialProducts={products} 
        categories={safeFilters.categories.filter(filterByLang)}
        colors={safeFilters.colors.filter(filterByLang)}
        sizes={safeFilters.sizes.filter(filterByLang)}
        locale={locale} 
      />
    </main>
  );
}