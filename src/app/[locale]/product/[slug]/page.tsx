import { Metadata } from 'next';
import { getProductBySlug } from '@/lib/api'; // ეს ფუნქცია დასამატებელია API-ში

// 1. დინამიური SEO მეტა ტეგების გენერაცია
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return {
    title: product.seo.title || product.name,
    description: product.seo.metaDesc || product.shortDescription,
    openGraph: {
      images: [product.image?.sourceUrl],
    },
  };
}

// 2. გვერდის რენდერი
export default async function ProductPage({ params }: any) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  // Schema.org მონაცემები (Rich Snippets)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image?.sourceUrl,
    description: product.description,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'GEL',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* აქ მოდის პროდუქტის დიზაინი: გალერეა, ფასი, ყიდვის ღილაკი */}
      <h1>{product.name}</h1>
    </div>
  );
}