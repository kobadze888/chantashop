'use client';

import Image from 'next/image';
import { Link, useRouter } from '@/navigation';
import { Eye, Heart, ShoppingBag, XCircle, CreditCard, Maximize } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useTranslations } from 'next-intl';
import { formatPrice } from '@/lib/utils';

const colorMap: Record<string, string> = {
  'shavi': '#000000', 'tetri': '#FFFFFF', 'lurji': '#2563EB', 'muqi_lurji': '#1E3A8A',
  'cisferi': '#60A5FA', 'beji': '#F5F5DC', 'yavisferi': '#8B4513', 'vardisferi': '#DB2777',
  'witeli': '#DC2626', 'mwvane': '#16A34A', 'stafilosferi': '#F97316', 'nacrisferi': '#9CA3AF',
  'vercxlisferi': '#C0C0C0', 'oqrosferi': '#FFD700', 'iasamnisferi': '#A855F7', 'kanisferi': '#FFE4C4'
};

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  salePrice?: string;
  regularPrice?: string;
  image: string;
  secondImage?: string; 
  slug: string;
  locale: string;
  attributes?: any; 
  stockQuantity?: number;
  stockStatus?: string;
  className?: string;
  onQuickView?: (e: React.MouseEvent) => void;
}

function isValidImageUrl(url: string | undefined): boolean {
  if (!url) return false;
  const validUrlRegex = /\.(jpe?g|png|gif|webp|svg)$/i;
  return url.length > 5 && validUrlRegex.test(url);
}

function calculateDiscount(regular: string, sale: string): number | null {
    if (!regular || !sale) return null;
    const reg = parseFloat(regular.replace(/[^0-9.]/g, ''));
    const sal = parseFloat(sale.replace(/[^0-9.]/g, ''));
    if (isNaN(reg) || isNaN(sal) || reg <= 0) return null;
    return Math.round(((reg - sal) / reg) * 100);
}

export default function ProductCard({ id, name, price, salePrice, regularPrice, image, secondImage, slug, attributes, stockQuantity, stockStatus, className, onQuickView }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();
  const t = useTranslations('Product');

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id, name, price: salePrice || price, image, slug, stockQuantity });
  };
  
  const handleBuyNow = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      addItem({ id, name, price: salePrice || price, image, slug, stockQuantity });
      router.push('/checkout');
  };

  const handleFullView = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      router.push(`/product/${slug}`);
  };

  const colorAttribute = attributes?.nodes?.find((attr: any) => attr.name === 'pa_color');
  const colorOptions = colorAttribute?.options || [];
  const hoverImageSource = isValidImageUrl(secondImage) ? secondImage : null;
  
  const isOutOfStock = stockQuantity === 0 || stockStatus !== 'IN_STOCK';

  const finalPrice = formatPrice(salePrice || price);
  const oldPrice = (regularPrice && regularPrice !== (salePrice || price)) ? formatPrice(regularPrice) : null;
  const discountPercent = (salePrice && regularPrice) ? calculateDiscount(regularPrice, salePrice) : null;

  return (
    <div className={`group relative flex flex-col bg-white rounded-[1.5rem] md:rounded-[1.8rem] p-3 md:p-4 transition-all duration-300 hover:shadow-2xl border border-gray-100 h-full ${isOutOfStock ? 'opacity-90' : ''} ${className || ''}`}>
      
      {/* --- Image Section --- */}
      <div className="relative mb-3 md:mb-4 aspect-[4/5] rounded-[1.2rem] md:rounded-[1.5rem] overflow-hidden bg-gray-50 product-card-image-wrapper isolate">
          
          {/* Main Link (Absolute Cover) - Fixes Nesting & Layout */}
          <Link 
            href={`/product/${slug}`} 
            className={`absolute inset-0 z-10 ${isOutOfStock ? 'cursor-not-allowed' : ''}`} 
            onClick={(e) => isOutOfStock && e.preventDefault()} 
          />

          {/* Overlay: Out of Stock */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/60 z-20 flex items-center justify-center backdrop-blur-[1px]">
                <div className="bg-black/80 text-white text-[10px] font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-2">
                    <XCircle className="w-3 h-3" />
                    {t('outOfStock')}
                </div>
            </div>
          )}

          {/* Images */}
          {isValidImageUrl(hoverImageSource) && (
            <img src={hoverImageSource} alt={`${name} hover`} className="hover-image" loading="lazy" />
          )}
          <Image src={image || '/placeholder.jpg'} alt={name} fill className="main-image object-cover" priority={true} />

          {/* Top Left: Badges */}
          <div className="absolute top-3 left-3 md:top-4 md:left-4 flex flex-col gap-1.5 z-20 pointer-events-none">
            {!isOutOfStock && discountPercent && (
                 <span className="bg-red-500 text-white text-[9px] md:text-[10px] font-bold px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg uppercase tracking-wider shadow-sm animate-fade-in">
                   -{discountPercent}%
                 </span>
            )}
            {!isOutOfStock && !discountPercent && salePrice && (
                <span className="bg-brand-DEFAULT text-white text-[9px] md:text-[10px] font-bold px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg uppercase tracking-wider shadow-sm">
                   SALE
                 </span>
            )}
          </div>

          {/* Top Right: Wishlist Button */}
          <button 
            className="absolute top-3 right-3 md:top-4 md:right-4 z-30 w-8 h-8 md:w-9 md:h-9 bg-white/90 backdrop-blur-md rounded-full text-brand-dark flex items-center justify-center shadow-sm hover:text-red-500 transition-colors active:scale-90 border border-gray-100"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          >
            <Heart className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>

          {/* Center Overlay Buttons (DESKTOP ONLY - Hover) */}
          <div className={`hidden md:flex absolute inset-0 items-center justify-center gap-3 z-30 transition-opacity duration-300 opacity-0 ${!isOutOfStock && 'group-hover:opacity-100'}`}>
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView?.(e); }} 
                className="w-11 h-11 bg-white text-brand-dark rounded-full flex items-center justify-center shadow-lg hover:bg-brand-DEFAULT hover:text-white transition-all transform hover:scale-110 active:scale-95" 
                title="სწრაფი ნახვა"
              >
                  <Eye className="w-5 h-5" />
              </button>
              
              <button 
                onClick={handleAddToCart}
                className="w-11 h-11 bg-white text-brand-dark rounded-full flex items-center justify-center shadow-lg hover:bg-brand-DEFAULT hover:text-white transition-all transform hover:scale-110 active:scale-95"
                title={t('addToCart')}
              >
                  <ShoppingBag className="w-5 h-5" />
              </button>

              <button 
                onClick={handleFullView}
                className="w-11 h-11 bg-white text-brand-dark rounded-full flex items-center justify-center shadow-lg hover:bg-brand-DEFAULT hover:text-white transition-all transform hover:scale-110 active:scale-95"
                title="სრულად ნახვა"
              >
                  <Maximize className="w-5 h-5" />
              </button>
          </div>
      </div>

      {/* --- Content Section --- */}
      <div className="flex-1 flex flex-col px-0.5 md:px-1">
          {/* Title */}
          <Link 
            href={`/product/${slug}`} 
            className={`font-bold text-brand-dark text-sm md:text-[15px] leading-tight mb-2 md:mb-3 hover:text-brand-DEFAULT transition-colors line-clamp-2 min-h-[2.5em] ${isOutOfStock ? 'pointer-events-none text-gray-400' : ''}`}
            title={name}
          >
            {name}
          </Link>
          
          {/* Colors */}
          <div className="flex gap-1 mb-3 md:mb-5 items-center min-h-[12px] md:min-h-[14px]">
              {colorOptions.length > 0 && !isOutOfStock ? (
                <>
                    {colorOptions.slice(0, 4).map((colorSlug: string, index: number) => (
                    <span 
                        key={index}
                        className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full border border-gray-200 shadow-sm"
                        style={{ backgroundColor: colorMap[colorSlug.toLowerCase()] || '#e5e7eb' }}
                    ></span>
                    ))}
                    {colorOptions.length > 4 && (
                    <span className="text-[9px] md:text-[10px] text-gray-400 font-medium">+{colorOptions.length - 4}</span>
                    )}
                </>
              ) : <div className="h-2.5 md:h-3"></div>}
          </div>

          {/* --- Bottom Action Bar --- */}
          <div className="mt-auto pt-3 md:pt-4 border-t border-dashed border-gray-100 flex items-center justify-between gap-2">
              
              {/* Left: Price */}
              <div className="flex flex-col">
                {oldPrice && (
                    <span className="text-[10px] md:text-[11px] text-gray-400 line-through font-medium mb-0.5">
                        {oldPrice}
                    </span>
                )}
                <span className={`text-lg md:text-xl font-serif font-black ${salePrice ? 'text-red-600' : 'text-brand-dark'}`}>
                    {finalPrice}
                </span>
              </div>
              
              {/* Right: Actions Group */}
              <div className="flex items-center gap-2">
                  {isOutOfStock ? (
                      // Out of Stock Label
                      <div className="h-10 md:h-11 px-4 bg-gray-100 text-gray-400 border border-gray-200 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold uppercase w-full cursor-not-allowed">
                          {t('outOfStock')}
                      </div>
                  ) : (
                      <>
                          {/* MOBILE: Compact Icons (Shopping Bag & Credit Card) */}
                          <div className="flex md:hidden gap-2">
                              <button 
                                onClick={handleAddToCart}
                                className="w-10 h-10 rounded-full bg-brand-DEFAULT text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                              >
                                <ShoppingBag className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={handleBuyNow}
                                className="w-10 h-10 rounded-full border border-gray-200 bg-white text-brand-dark flex items-center justify-center shadow-sm active:scale-95 transition-transform"
                              >
                                <CreditCard className="w-4 h-4" />
                              </button>
                          </div>

                          {/* DESKTOP: Expanded Text Button + Circle Button */}
                          <div className="hidden md:flex gap-2">
                              {/* Add to Cart (Pill with Text) */}
                              <button 
                                onClick={handleAddToCart}
                                className="h-11 px-5 rounded-full bg-brand-DEFAULT text-white flex items-center justify-center gap-2 shadow-lg shadow-brand-DEFAULT/20 transition-all active:scale-95 hover:bg-brand-dark hover:shadow-xl"
                              >
                                <ShoppingBag className="w-4 h-4" />
                                <span className="text-[11px] font-bold uppercase tracking-wider">{t('addToCart')}</span>
                              </button>

                              {/* Buy Now (Circle Icon with Border) */}
                              <button 
                                onClick={handleBuyNow}
                                className="w-11 h-11 rounded-full border-2 border-gray-200 text-brand-dark bg-white hover:border-brand-DEFAULT hover:bg-brand-DEFAULT hover:text-white shadow-sm flex items-center justify-center transition-all active:scale-90"
                                title={t('buyNow')}
                              >
                                <CreditCard className="w-5 h-5" />
                              </button>
                          </div>
                      </>
                  )}
              </div>

          </div>
      </div>
    </div>
  );
}