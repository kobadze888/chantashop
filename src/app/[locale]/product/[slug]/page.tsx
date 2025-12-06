// ფაილის გზა: src/app/[locale]/product/[slug]/page.tsx

import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/api';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ShoppingBag, Heart, Check, Minus } from 'lucide-react';
import parse from 'html-react-parser'; // ✅ ბიბლიოთეკის იმპორტი

// Dynamic metadata generation for SEO
export async function generateMetadata({ params }: { params: { slug: string, locale: string } }) {
  // ✅ params-ის გამოყენება პირდაპირ (არ არის Promise)
  const product = await getProductBySlug(params.slug, params.locale); 

  if (!product || product.length === 0) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    };
  }
  
  // Use SEO data fetched from WP (Yoast/Rank Math)
  return {
    title: product.seo?.title || product.name,
    description: product.seo?.metaDesc || product.shortDescription,
    alternates: {
        canonical: product.seo?.canonical,
    }
  };
}

export default async function ProductPage({ params }: { params: { slug: string, locale: string } }) {
  // ✅ params-ის გამოყენება პირდაპირ (არ არის Promise)
  const product = await getProductBySlug(params.slug, params.locale); 
  
  if (!product) {
    notFound();
  }

  const t = useTranslations('ProductPage');
  
  const formattedPrice = product.price || '0.00 ₾';
  const isSale = product.onSale;
  const oldPrice = product.regularPrice;
  const descriptionHtml = product.description || product.shortDescription;
  const images = product.galleryImages?.nodes || [];
  const inStock = product.stockStatus === 'IN_STOCK';

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 pt-24 md:pt-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
        
        {/* Image Gallery (Left Column) */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg bg-mocha-light">
            <Image
              src={images[0]?.sourceUrl || 'https://placehold.co/800x800/D6CCC2/4A403A?text=Main+Image'}
              alt={product.name || 'Product Image'}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2 md:gap-4">
            {images.slice(1, 5).map((img, index) => (
              <div key={index} className="relative aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                <Image
                  src={img.sourceUrl}
                  alt={img.altText || `Gallery image ${index + 2}`}
                  fill
                  sizes="25vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details (Right Column) */}
        <div className="space-y-6">
          <span className="text-sm font-medium text-mocha-DEFAULT uppercase tracking-wider">{product.productCategories?.nodes?.[0]?.name || t('category_default')}</span>
          <h1 className="text-4xl md:text-5xl font-black text-mocha-dark">{product.name}</h1>
          
          {/* Price */}
          <div className="flex items-center gap-4 border-b border-mocha-medium/50 pb-4">
            <p className={`text-3xl font-black ${isSale ? 'text-red-600' : 'text-mocha-DEFAULT'}`}>
              {formattedPrice}
            </p>
            {isSale && (
              <p className="text-xl text-gray-500 line-through">
                {oldPrice}
              </p>
            )}
          </div>

          {/* Options (Size/Color - Placeholder logic) */}
          <div className="space-y-4">
            <h3 className="font-bold text-mocha-dark">{t('select_size')}</h3>
            <div className="flex gap-3">
              {['Small', 'Medium', 'Large'].map(size => (
                <button key={size} className="px-4 py-2 rounded-full border border-mocha-medium/50 text-sm font-medium text-mocha-dark hover:bg-mocha-medium/20 transition">
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          {/* Add to Cart/Wishlist */}
          <div className="flex gap-4 pt-4">
            <button
              className="flex-1 flex items-center justify-center gap-2 bg-mocha-DEFAULT text-white py-4 rounded-xl font-bold text-lg hover:bg-mocha-dark transition active:scale-[0.98] shadow-md shadow-mocha-DEFAULT/40"
              onClick={() => {/* Add to Cart */}}
              disabled={!inStock}
            >
              <ShoppingBag className="w-5 h-5" />
              {inStock ? t('add_to_cart') : t('out_of_stock')}
            </button>
            <button
              className="p-4 rounded-xl border-2 border-mocha-DEFAULT text-mocha-DEFAULT hover:bg-mocha-DEFAULT hover:text-white transition"
              onClick={() => {/* Add to Wishlist */}}
            >
              <Heart className="w-6 h-6" />
            </button>
          </div>

          {/* Availability */}
          <div className="pt-6 border-t border-mocha-medium/50">
            <div className={`flex items-center gap-2 font-bold text-sm ${inStock ? 'text-green-600' : 'text-red-600'}`}>
              {inStock ? (
                <>
                  <Check className="w-5 h-5" />
                  {t('in_stock')}
                </>
              ) : (
                <>
                  <Minus className="w-5 h-5" />
                  {t('out_of_stock')}
                </>
              )}
            </div>
          </div>

        </div>
      </div>
      
      {/* Product Description */}
      <div className="mt-16 md:mt-24 max-w-4xl mx-auto">
        <h2 className="text-3xl font-black text-mocha-dark mb-6 border-b border-mocha-medium/50 pb-2">{t('description_title')}</h2>
        <div className="text-mocha-dark/90 leading-relaxed prose prose-lg">
          {parse(descriptionHtml || t('no_description'))}
        </div>
      </div>

      {/* Related Products Placeholder */}
      <div className="mt-24">
        <h2 className="text-3xl font-black text-mocha-dark mb-8">{t('related_products')}</h2>
        <div className="bg-mocha-medium/10 p-6 rounded-xl text-center text-mocha-dark/60">
          {t('related_placeholder')}
        </div>
      </div>

    </div>
  );
}