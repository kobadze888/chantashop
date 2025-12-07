import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Heart } from 'lucide-react';
import { getProductBySlug } from '@/lib/api'; // დარწმუნდით, რომ ეს ფაილი არსებობს
import type { Product } from '@/types';       // დარწმუნდით, რომ ეს ფაილი არსებობს

// იმპორტი მშობელი დირექტორიიდან (../)
import AddToCartButton from '../_components/AddToCartButton';
import ProductGallery from '../_components/ProductGallery';

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

// 1. დინამიური SEO მეტა ტეგების გენერაცია
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Next.js 15+ მოითხოვს params-ის await-ს
  const resolvedParams = await params;
  const { slug, locale } = resolvedParams;

  const product = await getProductBySlug(slug);

  if (!product) {
    return {};
  }

  return {
    title: product.seo?.title || product.name,
    description: product.seo?.metaDesc || product.shortDescription,
    openGraph: {
      images: [product.image?.sourceUrl || '/placeholder.jpg'],
      title: product.name,
      description: product.shortDescription,
      type: 'website', // ვიყენებთ 'website'-ს შეცდომის თავიდან ასაცილებლად
      url: `/${locale}/product/${slug}`,
      siteName: 'ChantaShop.ge',
    },
  };
}

// 2. გვერდის რენდერი
export default async function ProductPage({ params }: Props) {
  // Next.js 15+ მოითხოვს params-ის await-ს
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // მონაცემების წამოღება
  const product = (await getProductBySlug(slug)) as Product | null;

  // თუ პროდუქტი არ მოიძებნა (არასწორი slug ან წაშლილი პროდუქტი)
  if (!product) {
    notFound();
  }

  // მონაცემები კალათის კომპონენტისთვის
  const cartData = {
    id: product.databaseId,
    name: product.name,
    price: product.price,
    image: product.image?.sourceUrl || '/placeholder.jpg',
    slug: product.slug,
  };

  // Google Schema.org მონაცემები (აუცილებელია SEO-სთვის, რომ გუგლმა პროდუქტად აღიქვას)
  // აქ ფასი მუშავდება, რომ მოშორდეს სიმბოლოები (მაგ: ₾)
  const numericPrice = parseFloat(product.price.replace(/[^0-9.]/g, ''));
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image?.sourceUrl,
    description: product.description?.replace(/<[^>]*>?/gm, '') || product.shortDescription, // HTML ტეგების გასუფთავება
    sku: product.databaseId.toString(),
    offers: {
      '@type': 'Offer',
      price: isNaN(numericPrice) ? 0 : numericPrice,
      priceCurrency: 'GEL', 
      availability: product.stockStatus === 'IN_STOCK' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `https://chantashop.ge/product/${slug}`, // თქვენი მოთხოვნილი ზუსტი URL სტრუქტურა
    },
  };

  return (
    <div className="md:pt-32 pt-20 pb-24 bg-mocha-light min-h-screen">
      {/* Schema.org მონაცემების ჩასმა */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* პროდუქტის გალერეა (კლიენტ კომპონენტი) */}
          <div className="lg:sticky lg:top-32 h-min">
            <ProductGallery 
                mainImage={product.image?.sourceUrl || '/placeholder.jpg'} 
                gallery={product.galleryImages?.nodes.map(img => img.sourceUrl) || []} 
                alt={product.name}
            />
          </div>

          {/* პროდუქტის დეტალები */}
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl md:text-5xl font-black text-mocha-dark leading-tight">{product.name}</h1>
            
            {/* ფასი და ფასდაკლება */}
            <div className="flex items-center gap-4">
              {product.regularPrice && product.salePrice ? (
                <>
                  <span className="text-red-600 line-through text-xl opacity-70">{product.regularPrice}</span>
                  <span className="text-mocha-DEFAULT text-3xl font-black">{product.price}</span>
                </>
              ) : (
                <p className="text-3xl font-black text-mocha-DEFAULT">{product.price}</p>
              )}
            </div>

            {/* მარაგის სტატუსი */}
            <div className={`text-sm font-bold tracking-wider ${product.stockStatus === 'IN_STOCK' ? 'text-green-600' : 'text-red-600'}`}>
                {product.stockStatus === 'IN_STOCK' ? 'მარაგშია 🟢' : 'მარაგში არ არის 🔴'}
            </div>

            <div className="my-4 pt-4 border-t border-mocha-medium/30">
                <h3 className="text-lg font-bold mb-2 text-mocha-dark">მოკლე აღწერა</h3>
                {/* მოკლე აღწერის უსაფრთხო რენდერი */}
                <div 
                    className="text-mocha-dark/80 text-base leading-relaxed" 
                    dangerouslySetInnerHTML={{ __html: product.shortDescription || '<p>მოკლე აღწერა არ არის.</p>' }} 
                />
            </div>

            {/* ღილაკები (კლიენტ კომპონენტი) */}
            <div className="flex gap-4 items-center">
                <AddToCartButton product={cartData} stockStatus={product.stockStatus} />
                
                <button 
                  className="bg-white text-mocha-dark p-4 rounded-full border border-mocha-medium/50 hover:bg-mocha-medium/20 transition active:scale-95 shadow-md group"
                  aria-label="Add to Wishlist"
                >
                  <Heart className="w-5 h-5 group-hover:text-red-500 transition-colors" />
                </button>
            </div>

            <div className="mt-8 pt-6 border-t border-mocha-medium/30">
                <h3 className="text-lg font-bold mb-3 text-mocha-dark">დეტალური აღწერა</h3>
                {/* დეტალური აღწერის რენდერი */}
                <div 
                    className="prose max-w-none text-mocha-dark/80 prose-headings:text-mocha-dark prose-a:text-mocha-DEFAULT" 
                    dangerouslySetInnerHTML={{ __html: product.description || '<p>დეტალური აღწერა არ არის.</p>' }} 
                />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}