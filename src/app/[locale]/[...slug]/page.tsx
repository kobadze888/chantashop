// src/app/[locale]/[...slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CatalogClient from '@/components/catalog/CatalogClient';
import { getProducts, getFilters, getPageBySlug, getTaxonomySeo } from '@/lib/api';

type Props = {
  params: Promise<{ locale: string; slug: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  // 1. სტატიკური გვერდი (მაგ: /about-us)
  if (slug.length === 1) {
    const page = await getPageBySlug(slug[0]);
    if (page) {
      return { 
        title: page.seo?.title || page.title, 
        description: page.seo?.metaDesc 
      };
    }
  }

  // 2. ატრიბუტის გვერდი (მაგ: /color/shavi ან /material/tyavi)
  if (slug.length === 2) {
     const [attrType, attrSlug] = slug;
     let seoData = null;

     // ვამოწმებთ ფერია თუ მასალა
     if (['color', 'fer', 'pa_color'].includes(attrType)) {
        seoData = await getTaxonomySeo('color', attrSlug);
     } else if (['material', 'masala', 'pa_masala'].includes(attrType)) {
        seoData = await getTaxonomySeo('material', attrSlug);
     }

     // თუ მონაცემები მოვიდა, ვაბრუნებთ ქართულ სათაურს
     if (seoData) {
        const title = seoData.seo?.title || `${seoData.name} | ChantaShop`;
        const desc = seoData.seo?.metaDesc || `შეარჩიეთ ${seoData.name} ფერის/მასალის ჩანთები.`;
        
        return { 
           title: title,
           description: desc,
           openGraph: {
             title: seoData.seo?.opengraphTitle || title,
             description: seoData.seo?.opengraphDescription || desc,
             images: seoData.seo?.opengraphImage?.sourceUrl ? [seoData.seo.opengraphImage.sourceUrl] : [],
           },
           alternates: {
             canonical: seoData.seo?.canonical
           }
        };
     }
  }

  // თუ ვერაფერი ვიპოვეთ
  return { title: 'ChantaShop', robots: { index: false } };
}

export default async function CatchAllPage({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  const resolvedSearchParams = await searchParams;

  // --- ლოგიკა 1: სტატიკური გვერდი ---
  if (slug.length === 1) {
    const page = await getPageBySlug(slug[0]);
    if (page) {
      return (
        <div className="container mx-auto px-6 py-24 md:py-32">
          <h1 className="text-3xl font-bold mb-6 text-brand-dark">{page.title}</h1>
          <div className="prose max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: page.content || '' }} />
        </div>
      );
    }
  }

  // --- ლოგიკა 2: კატალოგი (ფილტრი ან კატეგორია) ---
  const minPrice = typeof resolvedSearchParams.minPrice === 'string' ? Number(resolvedSearchParams.minPrice) : undefined;
  const maxPrice = typeof resolvedSearchParams.maxPrice === 'string' ? Number(resolvedSearchParams.maxPrice) : undefined;
  const sort = typeof resolvedSearchParams.sort === 'string' ? resolvedSearchParams.sort : 'DATE_DESC';

  const apiFilters: any = {
    limit: 50,
    sort: sort as any,
    minPrice,
    maxPrice,
  };

  let isAttributePage = false;

  if (slug.length === 2) {
     const [attr, value] = slug;
     if (['color', 'fer', 'pa_color'].includes(attr)) {
        apiFilters.color = value;
        isAttributePage = true;
     } else if (['material', 'masala', 'pa_masala'].includes(attr)) {
        apiFilters.material = value;
        isAttributePage = true;
     }
  }

  // თუ არ არის ატრიბუტი და 1 სეგმენტია, ვცადოთ როგორც კატეგორია
  if (!isAttributePage && slug.length === 1) {
     apiFilters.category = slug[slug.length - 1]; 
  }

  const [products, filters] = await Promise.all([
    getProducts(apiFilters, locale),
    getFilters()
  ]);

  const safeFilters = filters || { categories: [], colors: [], sizes: [] };

  return (
    <main className="pt-28 md:pt-36 pb-24 min-h-screen bg-white">
      <CatalogClient 
        initialProducts={products || []} 
        categories={safeFilters.categories}
        colors={safeFilters.colors}
        sizes={safeFilters.sizes}
        locale={locale} 
      />
    </main>
  );
}