// src/app/[locale]/[attribute]/[slug]/page.tsx
import { Metadata } from 'next';
import { getProducts, getFilters } from '@/lib/api';
import CatalogClient from '@/components/catalog/CatalogClient';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ attribute: string, slug: string }> }): Promise<Metadata> {
  const { attribute, slug } = await params;
  return {
    title: `${attribute}: ${slug} | ChantaShop`,
  };
}

export default async function AttributePage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ locale: string, attribute: string, slug: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const { locale, attribute, slug } = await params;
  const resolvedSearchParams = await searchParams;

  // ვიღებთ დანარჩენ ფილტრებს
  const category = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : 'all';
  const maxPrice = typeof resolvedSearchParams.maxPrice === 'string' ? parseInt(resolvedSearchParams.maxPrice) : 5000;
  const sort = typeof resolvedSearchParams.sort === 'string' ? resolvedSearchParams.sort : 'DATE_DESC';

  // URL-ის ატრიბუტის გადათარგმნა API-ის პარამეტრებში
  // მაგ: URL-ში არის "color", API ითხოვს "color"-ს.
  // მაგ: URL-ში არის "masala", API ითხოვს "material"-ს (შენი api.ts-ის მიხედვით).
  
  let apiFilters: any = {
    category: category !== 'all' ? category : undefined,
    maxPrice: maxPrice < 5000 ? maxPrice : undefined,
    limit: 100,
    sort: sort as any
  };

  // ლოგიკა: რომელი ატრიბუტია URL-ში?
  if (attribute === 'color' || attribute === 'fux') {
      apiFilters.color = slug;
  } else if (attribute === 'masala' || attribute === 'material') {
      apiFilters.material = slug;
  } else {
      // თუ უცნობი ატრიბუტია, შეგვიძლია 404 დავაბრუნოთ ან ვცადოთ მაინც
      console.warn('Unknown attribute in URL:', attribute);
  }

  // დამატებითი ფილტრები URL-დან (მაგ: ფერის გვერდზე მასალის ფილტრი)
  if (resolvedSearchParams.color && typeof resolvedSearchParams.color === 'string') {
      apiFilters.color = resolvedSearchParams.color;
  }
  if (resolvedSearchParams.material && typeof resolvedSearchParams.material === 'string') {
      apiFilters.material = resolvedSearchParams.material;
  }

  const [products, filters] = await Promise.all([
    getProducts(apiFilters, locale), 
    getFilters()
  ]);

  if (!products) {
     notFound();
  }

  return (
    <main className="pt-28 md:pt-36 pb-24 min-h-screen bg-white">
      <CatalogClient 
        initialProducts={products} 
        categories={filters.categories}
        colors={filters.colors}
        sizes={filters.sizes}
        locale={locale} 
      />
    </main>
  );
}