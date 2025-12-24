'use client';

import Image from 'next/image';
import { Link, useRouter } from '@/navigation';
import { Eye, Heart, ShoppingBag, XCircle, CreditCard, Maximize } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore'; 
import { useTranslations } from 'next-intl';
import { formatPrice } from '@/lib/utils';
import { useState, useEffect } from 'react';

// ფერების კოდები
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
  stockStatusManual?: string;
  className?: string;
  index?: number;
  onQuickView?: (e: React.MouseEvent) => void;
  shortDescription?: string;
  description?: string;
  productCategories?: any;
  priority?: boolean;
}

function isValidImageUrl(url: string | undefined | null): boolean {
  if (!url || url.includes('placeholder')) return false;
  return url.startsWith('http') && url.length > 10;
}

function calculateDiscount(regular: string, sale: string): number | null {
  if (!regular || !sale) return null;
  const reg = parseFloat(regular.replace(/[^0-9.]/g, ''));
  const sal = parseFloat(sale.replace(/[^0-9.]/g, ''));
  if (isNaN(reg) || isNaN(sal) || reg <= 0) return null;
  if (reg === sal) return null; 
  return Math.round(((reg - sal) / reg) * 100);
}

export default function ProductCard(props: ProductCardProps) {
  const {
    id, name, price, salePrice, regularPrice, image, secondImage,
    slug, attributes, stockQuantity, stockStatus, stockStatusManual, className,
    index = 0, onQuickView, locale, shortDescription, description, productCategories,
    priority = false 
  } = props;

  const addItem = useCartStore((state) => state.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const t = useTranslations('Product');

  const [imgSrc, setImgSrc] = useState(isValidImageUrl(image) ? image : '/placeholder.jpg');
  const [hoverImgSrc, setHoverImgSrc] = useState(isValidImageUrl(secondImage) ? secondImage : null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLiked = mounted ? isInWishlist(id) : false;
  const isOutOfStock = stockStatusManual === 'outofstock' || stockStatus === 'OUT_OF_STOCK' || stockQuantity === 0;

  // ფასების ლოგიკა
  const rawRegular = regularPrice ? parseFloat(regularPrice.replace(/[^0-9.]/g, '')) : 0;
  const rawSale = salePrice ? parseFloat(salePrice.replace(/[^0-9.]/g, '')) : 0;
  const hasDiscount = salePrice && regularPrice && rawSale < rawRegular;

  const displayPrice = hasDiscount ? formatPrice(salePrice) : formatPrice(price);
  const displayOldPrice = hasDiscount ? formatPrice(regularPrice) : null;
  const discountPercent = hasDiscount ? calculateDiscount(regularPrice!, salePrice!) : null;

  // კატეგორიის წამოღება
  const categoryName = productCategories?.nodes?.[0]?.name;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem({ id, name, price: salePrice || price, image: imgSrc, slug, stockQuantity });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem({ id, name, price: salePrice || price, image: imgSrc, slug, stockQuantity });
    router.push('/checkout');
  };

  const handleFullView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push({ pathname: '/product/[slug]', params: { slug } });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({ 
      id, name, price, salePrice, regularPrice, image, slug, 
      attributes, stockQuantity, stockStatus, shortDescription, description, productCategories
    });
  };

  const colorAttribute = attributes?.nodes?.find((attr: any) => 
    attr.name === 'pa_color' || attr.name === 'color' || attr.label === 'ფერი'
  );
  const colorOptions = colorAttribute?.options || [];

  return (
    <div 
      className={`group relative flex flex-col w-full h-full bg-white border border-gray-200 rounded-2xl p-3 transition-all duration-300 hover:shadow-xl hover:border-brand-DEFAULT/30 cursor-pointer ${isOutOfStock ? 'opacity-80' : ''} ${className || ''}`}
      onClick={handleFullView}
    >
      
      {/* 1. სურათის სექცია */}
      <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-gray-50 mb-3 border border-gray-100 cursor-pointer">
        
        {/* Badges - წითელი ფონი */}
        <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1.5 pointer-events-none">
           {!isOutOfStock && hasDiscount && discountPercent && (
            <span className="bg-rose-600 text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-sm tracking-wide">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* მარჯვენა მხარეს ღილაკები (Wishlist + QuickView) */}
        <div className="absolute top-2.5 right-2.5 z-30 flex flex-col gap-1.5">
            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              className={`p-2 rounded-full transition-all duration-200 shadow-sm border active:scale-95 cursor-pointer ${
                isLiked 
                ? 'bg-white text-brand-DEFAULT border-brand-DEFAULT/20 shadow-md' 
                : 'bg-white/90 text-gray-500 border-transparent hover:text-brand-DEFAULT hover:bg-white backdrop-blur-sm'
              }`}
              title={t('addToWishlist')}
            >
              <Heart className={`w-4.5 h-4.5 ${isLiked ? 'fill-current' : ''}`} strokeWidth={2} />
            </button>

            {/* Quick View */}
            <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView?.(e); }}
                className="hidden md:flex p-2 rounded-full bg-white/90 text-gray-600 border border-transparent hover:text-brand-DEFAULT hover:bg-white hover:border-brand-DEFAULT/20 shadow-sm transition-all duration-300 transform translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 backdrop-blur-sm active:scale-95 cursor-pointer"
                title={t('quickView')}
            >
                <Eye className="w-4.5 h-4.5" strokeWidth={2}/>
            </button>
        </div>

        {/* კატეგორია - სურათის მარცხენა ქვედა კუთხეში */}
        {categoryName && (
           <div className="absolute bottom-2.5 left-2.5 z-20 pointer-events-none">
             <span className="bg-white/90 backdrop-blur-[4px] text-gray-900 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-sm border border-gray-100/50">
               {categoryName}
             </span>
           </div>
        )}

        {/* Out of stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
             <div className="bg-black/90 text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-xl">
                <XCircle className="w-3.5 h-3.5" />
                {t('outOfStock')}
             </div>
          </div>
        )}

        {/* სურათები - Fade Effect Only */}
        {hoverImgSrc && !isOutOfStock && (
          <Image
            src={hoverImgSrc}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
            onError={() => setHoverImgSrc(null)}
          />
        )}
        
        <Image
          src={imgSrc}
          alt={name}
          fill
          priority={priority}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover z-0 transition-transform duration-700" 
          onError={() => setImgSrc('/placeholder.jpg')}
        />
      </div>

      {/* 2. ინფორმაციის სექცია */}
      <div className="flex flex-col flex-1 gap-1.5">
        
        {/* სათაური */}
        <Link 
          href={{ pathname: '/product/[slug]', params: { slug } }}
          className="text-gray-900 font-semibold text-[15px] leading-tight line-clamp-2 min-h-[2.5em] hover:text-brand-DEFAULT transition-colors cursor-pointer"
          title={name}
          onClick={(e) => e.stopPropagation()}
        >
          {name}
        </Link>

        {/* ფასები და ფერები */}
        <div className="flex justify-between items-end mt-auto mb-3">
            {/* ფასები */}
            <div className="flex flex-col gap-0.5 leading-none">
                 <span className={`text-[19px] font-bold tracking-tight ${hasDiscount ? 'text-brand-DEFAULT' : 'text-gray-900'}`}>
                   {displayPrice}
                 </span>
                 {hasDiscount && displayOldPrice && (
                   <span className="text-xs text-gray-400 line-through decoration-gray-300">
                     {displayOldPrice}
                   </span>
                 )}
            </div>

            {/* ფერები (თუ არის) */}
            {colorOptions.length > 0 && !isOutOfStock && (
                <div className="flex -space-x-1.5 pb-1">
                  {colorOptions.slice(0, 4).map((colorSlug: string, idx: number) => (
                    <div
                      key={idx}
                      className="w-4 h-4 rounded-full border border-white ring-1 ring-gray-200 shadow-sm transition-transform hover:scale-110 hover:z-10 relative cursor-pointer"
                      style={{ backgroundColor: colorMap[colorSlug.toLowerCase()] || colorSlug }}
                    />
                  ))}
                  {colorOptions.length > 4 && (
                      <div className="w-4 h-4 rounded-full border border-white bg-gray-100 flex items-center justify-center text-[9px] text-gray-500 font-bold z-10">
                          +
                      </div>
                  )}
                </div>
            )}
        </div>

        {/* 3. ღილაკები - თარგმნილი წარწერებით */}
        <div className="flex gap-2 h-11">
           {isOutOfStock ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-center rounded-xl text-[10px] font-bold uppercase cursor-not-allowed tracking-wider border border-gray-100">
                {t('outOfStock')}
              </div>
           ) : (
             <>
               {/* კალათა - მხოლოდ აიკონი მობილურზე, ტექსტით დესკტოპზე */}
               <button
                 onClick={handleAddToCart}
                 className="group/btn flex items-center justify-center w-12 md:w-auto md:flex-1 bg-white text-gray-900 border border-gray-200 rounded-xl hover:border-black hover:bg-gray-50 transition-all active:scale-95 shadow-sm cursor-pointer px-2"
                 title={t('addToCart')}
               >
                 <ShoppingBag className="w-5 h-5 md:w-4 md:h-4 md:mr-1.5" />
                 <span className="hidden md:block text-[11px] font-bold uppercase truncate">
                    {t('addToCart')}
                 </span>
               </button>

               {/* ყიდვა - ტექსტით ყველგან, ვარდისფერი */}
               <button
                 onClick={handleBuyNow}
                 className="flex-1 flex items-center justify-center bg-brand-DEFAULT text-white rounded-xl hover:bg-brand-dark transition-all active:scale-95 shadow-sm hover:shadow-brand-DEFAULT/20 cursor-pointer px-2 gap-1.5"
                 title={t('buyNow')}
               >
                 <CreditCard className="w-4 h-4" />
                 <span className="text-[11px] font-bold uppercase truncate">
                   {t('buyNow')}
                 </span>
               </button>
             </>
           )}
        </div>
      </div>
    </div>
  );
}