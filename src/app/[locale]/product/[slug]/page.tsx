import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/api';
import type { Product } from '@/types';
import ProductInfo from '../_components/ProductInfo'; // ახალი მთავარი კომპონენტი

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

// SEO Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug, locale } = resolvedParams;
  const product = await getProductBySlug(slug);

  if (!product) return {};

  return {
    title: product.seo?.title || product.name,
    description: product.seo?.metaDesc || product.shortDescription,
    openGraph: {
      images: [product.image?.sourceUrl || '/placeholder.jpg'],
      title: product.name,
      description: product.shortDescription,
      type: 'website',
      url: `/${locale}/product/${slug}`,
      siteName: 'ChantaShop.ge',
    },
  };
}

// Page Render
export default async function ProductPage({ params }: Props) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const product = (await getProductBySlug(slug)) as Product | null;

  if (!product) {
    notFound();
  }

  // Google Schema (Rich Snippets)
  const numericPrice = parseFloat(product.price.replace(/[^0-9.]/g, ''));
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image?.sourceUrl,
    description: product.description?.replace(/<[^>]*>?/gm, '') || product.shortDescription,
    sku: product.databaseId.toString(),
    offers: {
      '@type': 'Offer',
      price: isNaN(numericPrice) ? 0 : numericPrice,
      priceCurrency: 'GEL', 
      availability: product.stockStatus === 'IN_STOCK' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `https://chantashop.ge/product/${slug}`,
    },
  };

  return (
    <div className="md:pt-32 pt-20 pb-24 bg-mocha-light min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="container mx-auto px-4">
        {/* მთელი ლოგიკა გადავიდა კლიენტურ კომპონენტში */}
        <ProductInfo product={product} />
      </div>
    </div>
  );
}