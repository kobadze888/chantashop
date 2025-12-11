// src/app/[locale]/shop/page.tsx
import { Metadata } from 'next';
import { getProducts, getFilters, getPageBySlugReal } from '@/lib/api';
import CatalogClient from '@/components/catalog/CatalogClient';
import { FilterTerm } from '@/types';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// ⚠️ აქ გაწერეთ ზუსტად ის სლაგები, რაც WordPress-მა მიანიჭა გვერდებს
const wpSlugs: Record<string, string> = {
  ka: 'shop',      // ქართული გვერდის სლაგი
  en: 'shop-3',    // ინგლისურის სლაგი (შეამოწმეთ WP-ში, შეიძლება იყოს full-catalog)
  ru: 'shop-2'     // რუსულის სლაგი (შეამოწმეთ WP-ში)
};

// ✅ Shop გვერდის SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  
  // ვიღებთ შესაბამის სლაგს ენის მიხედვით
  // თუ ვერ იპოვა, ვიყენებთ 'shop'-ს
  const slugToFetch = wpSlugs[locale] || 'shop';

  // ვეძებთ გვერდს ამ კონკრეტული სლაგით
  const pageData = await getPageBySlugReal(slugToFetch);

  // Yoast-ის მონაცემები
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
  const color = typeof resolvedSearchParams.color === 'string' ? resolvedSearchParams.color : 'all';
  const material = typeof resolvedSearchParams.material === 'string' ? resolvedSearchParams.material : 'all';
  
  const minPrice = typeof resolvedSearchParams.minPrice === 'string' ? Number(resolvedSearchParams.minPrice) : undefined;
  const maxPrice = typeof resolvedSearchParams.maxPrice === 'string' ? Number(resolvedSearchParams.maxPrice) : undefined;
  const sort = typeof resolvedSearchParams.sort === 'string' ? resolvedSearchParams.sort : 'DATE_DESC';

  // API მოთხოვნა (ენა დინამიურია - api.ts-ში გასწორდა)
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

  // ფილტრები ვაჩვენოთ იმ ენაზე, რომელიც არჩეულია
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