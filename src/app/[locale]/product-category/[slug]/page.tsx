// src/app/[locale]/product-category/[slug]/page.tsx
import { Metadata } from 'next';
import { getProducts, getFilters, getTaxonomySeo } from '@/lib/api';
import CatalogClient from '@/components/catalog/CatalogClient';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  
  const categoryData = await getTaxonomySeo('category', slug);

  if (!categoryData) {
    return { title: 'კატეგორია ვერ მოიძებნა | ChantaShop' };
  }

  const seoTitle = categoryData.seo?.title || `${categoryData.name} | ChantaShop`;
  const seoDesc = categoryData.seo?.metaDesc || categoryData.description || `შეიძინეთ ${categoryData.name} საუკეთესო ფასად.`;

  return {
    title: seoTitle,
    description: seoDesc,
    openGraph: {
      title: categoryData.seo?.opengraphTitle || seoTitle,
      description: categoryData.seo?.opengraphDescription || seoDesc,
      images: categoryData.seo?.opengraphImage?.sourceUrl ? [categoryData.seo.opengraphImage.sourceUrl] : [],
      locale: locale,
      type: 'website',
    },
    alternates: {
      canonical: categoryData.seo?.canonical || `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/product-category/${slug}`,
    }
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  const resolvedSearchParams = await searchParams;

  const minPrice = typeof resolvedSearchParams.minPrice === 'string' ? Number(resolvedSearchParams.minPrice) : undefined;
  const maxPrice = typeof resolvedSearchParams.maxPrice === 'string' ? Number(resolvedSearchParams.maxPrice) : undefined;
  const sort = typeof resolvedSearchParams.sort === 'string' ? resolvedSearchParams.sort : 'DATE_DESC';

  const [products, filters] = await Promise.all([
    getProducts({ 
      category: slug, 
      minPrice,
      maxPrice,
      limit: 100,
      sort: sort as any
    }, locale), 
    getFilters(locale) // ✅ ვაწვდით ენას
  ]);

  if (!products) {
     notFound();
  }

  const safeFilters = filters || { categories: [], attributes: [] };

  return (
    <main className="pt-28 md:pt-36 pb-24 min-h-screen bg-white">
      <CatalogClient 
        initialProducts={products} 
        categories={safeFilters.categories}
        attributes={safeFilters.attributes}
        locale={locale} 
      />
    </main>
  );
}