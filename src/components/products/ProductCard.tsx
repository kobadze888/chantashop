'use client';

import Image from 'next/image';
import { Link, useRouter } from '@/navigation';
import { Eye, Heart, ShoppingBag, XCircle, CreditCard, Maximize } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore'; 
import { useTranslations } from 'next-intl';
import { formatPrice } from '@/lib/utils';
import { useState, useEffect } from 'react';

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
  index?: number;
  onQuickView?: (e: React.MouseEvent) => void;
  shortDescription?: string;
  description?: string;
  productCategories?: any;
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
  return Math.round(((reg - sal) / reg) * 100);
}

export default function ProductCard(props: ProductCardProps) {
  const {
    id, name, price, salePrice, regularPrice, image, secondImage,
    slug, attributes, stockQuantity, stockStatus, className,
    index = 0, onQuickView, locale, shortDescription, description, productCategories
  } = props;

  const addItem = useCartStore((state) => state.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const t = useTranslations('Product');

  const [imgSrc, setImgSrc] = useState(isValidImageUrl(image) ? image : '/placeholder.jpg');
  const [hoverImgSrc, setHoverImgSrc] = useState(isValidImageUrl(secondImage) ? secondImage : null);

  const isPriority = index < 4;

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLiked = mounted ? isInWishlist(id) : false;

  // ✅ გასწორებული ლოგიკა: ამოწმებს ორივე ვარიანტს (დიდი ასოებით და პატარათი)
  const isOutOfStock = stockStatus === 'OUT_OF_STOCK' || stockStatus === 'outofstock' || stockQuantity === 0;

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

  const finalPrice = formatPrice(salePrice || price);
  const oldPrice = (regularPrice && regularPrice !== (salePrice || price)) ? formatPrice(regularPrice) : null;
  const discountPercent = (salePrice && regularPrice) ? calculateDiscount(regularPrice, salePrice) : null;

  return (
    <div className={`group relative flex flex-col bg-white rounded-[1.5rem] md:rounded-[1.8rem] p-3 md:p-4 transition-all duration-300 hover:shadow-2xl border border-gray-100 h-full ${isOutOfStock ? 'opacity-80' : ''} ${className || ''}`}>

      <div className="relative mb-3 md:mb-4 aspect-[4/5] rounded-[1.2rem] md:rounded-[1.5rem] overflow-hidden bg-gray-50 product-card-image-wrapper">

        <Link
          href={{ pathname: '/product/[slug]', params: { slug } }}
          className={`absolute inset-0 z-10 ${isOutOfStock ? 'cursor-not-allowed' : ''}`}
          onClick={(e) => isOutOfStock && e.preventDefault()}
        />

        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 z-20 flex items-center justify-center backdrop-blur-[1px]">
            <div className="bg-black/80 text-white text-[10px] font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-2">
              <XCircle className="w-3 h-3" />
              {t('outOfStock')}
            </div>
          </div>
        )}

        {hoverImgSrc && (
          <Image
            src={hoverImgSrc}
            alt={`${name} hover`}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="hover-image object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden md:block"
            onError={() => setHoverImgSrc(null)}
          />
        )}

        <Image
          src={imgSrc}
          alt={name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="main-image object-cover"
          priority={isPriority}
          onError={() => setImgSrc('/placeholder.jpg')}
        />

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

        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 md:top-4 md:right-4 p-2.5 rounded-full shadow-lg transition-all duration-300 z-40 active:scale-90 cursor-pointer ${
            isLiked
              ? 'bg-red-500 text-white border-red-500'
              : 'bg-white/90 text-brand-dark hover:bg-red-500 hover:text-white border-transparent'
          } border-2`}
        >
          <Heart className={`w-4 h-4 md:w-5 md:h-5 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        {/* Desktop Quick Actions */}
        <div className={`hidden md:flex absolute inset-0 items-center justify-center gap-3 z-30 transition-opacity duration-300 opacity-0 ${!isOutOfStock && 'group-hover:opacity-100'}`}>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView?.(e); }}
            className="w-11 h-11 bg-white text-brand-dark rounded-full flex items-center justify-center shadow-lg hover:bg-brand-DEFAULT hover:text-white transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
            title="სწრაფი ნახვა"
          >
            <Eye className="w-5 h-5" />
          </button>

          <button
            onClick={handleFullView}
            className="w-11 h-11 bg-white text-brand-dark rounded-full flex items-center justify-center shadow-lg hover:bg-brand-DEFAULT hover:text-white transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
            title="სრულად ნახვა"
          >
            <Maximize className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-0.5 md:px-1">
        <Link
          href={{ pathname: '/product/[slug]', params: { slug } }}
          className={`font-bold text-brand-dark text-sm md:text-[15px] leading-tight mb-2 md:mb-3 hover:text-brand-DEFAULT transition-colors line-clamp-2 min-h-[2.5em] ${isOutOfStock ? 'text-gray-400 pointer-events-none' : ''}`}
          title={name}
        >
          {name}
        </Link>

        <div className="flex gap-1 mb-3 md:mb-5 items-center min-h-[12px] md:min-h-[14px]">
          {colorOptions.length > 0 && !isOutOfStock ? (
            <>
              {colorOptions.slice(0, 4).map((colorSlug: string, index: number) => (
                <span
                  key={index}
                  className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full border border-gray-200 shadow-sm"
                  style={{ backgroundColor: colorMap[colorSlug.toLowerCase()] || colorSlug }}
                ></span>
              ))}
            </>
          ) : <div className="h-2.5 md:h-3"></div>}
        </div>

        <div className="mt-auto pt-3 md:pt-4 border-t border-dashed border-gray-100 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            {oldPrice && <span className="text-[10px] md:text-[11px] text-gray-400 line-through font-medium mb-0.5">{oldPrice}</span>}
            <span className={`text-lg md:text-xl font-serif font-black ${salePrice ? 'text-red-600' : 'text-brand-dark'}`}>
              {finalPrice}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isOutOfStock ? (
              <>
                {/* მობილური ღილაკები */}
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

                {/* დესკტოპ ღილაკები */}
                <div className="hidden md:flex gap-2">
                  <button
                    onClick={handleAddToCart}
                    className="h-11 px-5 rounded-full bg-brand-DEFAULT text-white flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 hover:bg-brand-dark cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">{t('addToCart')}</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="w-11 h-11 rounded-full border-2 border-gray-200 text-brand-dark bg-white hover:border-brand-DEFAULT hover:bg-brand-DEFAULT hover:text-white shadow-sm flex items-center justify-center transition-all active:scale-90 cursor-pointer"
                    title={t('buyNow')}
                  >
                    <CreditCard className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="h-11 px-5 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-[10px] font-bold uppercase">
                {t('outOfStock')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}