'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Eye, Heart, ShoppingBag, XCircle, CreditCard, Maximize } from 'lucide-react';
import { Link, useRouter } from '@/navigation';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore'; 
import { useTranslations } from 'next-intl';
import { formatPrice } from '@/lib/utils';

/**
 * ფერების კოდების რუკა - გამოიყენება პროდუქტის ფერების სვოტჩების დასახატად
 */
// ✅ განახლებული ColorMap ყველა ენისთვის
  const colorMap: Record<string, string> = { 
    'shavi': '#000000', 'black-en': '#000000', 'chernyj-ru': '#000000', 'შავი': '#000000',
    'tetri': '#FFFFFF', 'white-en': '#FFFFFF', 'belyj-ru': '#FFFFFF', 'თეთრი': '#FFFFFF',
    'lurji': '#2563EB', 'blue-en': '#2563EB', 'sinij-ru': '#2563EB', 'ლურჯი': '#2563EB',
    'tsiteli': '#DC2626', 'red-en': '#DC2626', 'krasnyj-ru': '#DC2626', 'წითელი': '#DC2626',
    'beji': '#F5F5DC', 'beige-en': '#F5F5DC', 'bezhevyj-ru': '#F5F5DC', 'bejevi': '#F5F5DC', 'ბეჟი': '#F5F5DC',
    'yavisferi': '#8B4513', 'brown-en': '#8B4513', 'korichnevyj-ru': '#8B4513', 'ყავისფერი': '#8B4513',
    'vardisferi': '#DB2777', 'pink-en': '#DB2777', 'rozovyj-ru': '#DB2777', 'ვარდისფერი': '#DB2777',
    'mwvane': '#16A34A', 'green-en': '#16A34A', 'zelenyj-ru': '#16A34A', 'მწვანე': '#16A34A',
    'stafilosferi': '#F97316', 'orange-en': '#F97316', 'oranzhevyj-ru': '#F97316', 'ნარინჯისფერი': '#F97316',
    'yviteli': '#FACC15', 'yellow-en': '#FACC15', 'zheltyj-ru': '#FACC15', 'ყვითელი': '#FACC15',
    'rcuxi': '#9CA3AF', 'nacrisferi': '#9CA3AF', 'grey-en': '#9CA3AF', 'seryj-ru': '#9CA3AF', 'რუხი': '#9CA3AF',
    'cisferi': '#60A5FA', 'light-blue-en': '#60A5FA', 'goluboj-ru': '#60A5FA', 'ცისფერი': '#60A5FA',
    'muqi_lurji': '#1E3A8A', 'dark-blue-en': '#1E3A8A', 'temno-sinij-ru': '#1E3A8A', 'მუქი ლურჯი': '#1E3A8A',
    'vercxlisferi': '#C0C0C0', 'silver-en': '#C0C0C0', 'serebristyj-ru': '#C0C0C0',
    'oqrosferi': '#FFD700', 'gold-en': '#FFD700', 'zolotistyj-ru': '#FFD700',
    'iasamnisferi': '#A855F7', 'purple-en': '#A855F7', 'fioletovyj-ru': '#A855F7',
    'kanisferi': '#FFE4C4', 'nude-en': '#FFE4C4', 'telesnyj-ru': '#FFE4C4', 
    'vardisferi_(pradas_stili)': '#DB2777', 'ვარდისფერი (პრადა)': '#DB2777'
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

/**
 * ამოწმებს სურათის ლინკის ვალიდურობას
 */
function isValidImageUrl(url: string | undefined | null): boolean {
  if (!url || url.includes('placeholder')) return false;
  return url.startsWith('http') && url.length > 10;
}

/**
 * ითვლის ფასდაკლების პროცენტს
 */
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
    onQuickView, productCategories, priority = false
  } = props;

  const addItem = useCartStore((state) => state.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const t = useTranslations('Product');

  // სურათების მდგომარეობა
  const [imgSrc, setImgSrc] = useState(isValidImageUrl(image) ? image : '/placeholder.jpg');
  const [hoverImgSrc, setHoverImgSrc] = useState(isValidImageUrl(secondImage) ? secondImage : null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLiked = mounted ? isInWishlist(id) : false;
  const isOutOfStock = stockStatusManual === 'outofstock' || stockStatus === 'OUT_OF_STOCK' || stockQuantity === 0;

  // ფასების ფორმატირება და ფასდაკლების ლოგიკა
  const rawRegular = regularPrice ? parseFloat(regularPrice.replace(/[^0-9.]/g, '')) : 0;
  const rawSale = salePrice ? parseFloat(salePrice.replace(/[^0-9.]/g, '')) : 0;
  const hasDiscount = salePrice && regularPrice && rawSale < rawRegular;

  const displayPrice = hasDiscount ? formatPrice(salePrice) : formatPrice(price);
  const displayOldPrice = hasDiscount ? formatPrice(regularPrice) : null;
  const discountPercent = hasDiscount ? calculateDiscount(regularPrice!, salePrice!) : null;

  const categoryName = productCategories?.nodes?.[0]?.name;

  // ვარიაციების (მაგ: ფერების) შემოწმება
  const colorAttribute = attributes?.nodes?.find((attr: any) => 
    attr.name === 'pa_color' || attr.name === 'color' || attr.label === 'ფერი'
  );
  const colorOptions = colorAttribute?.options || [];
  const hasVariations = colorOptions.length > 0;

  /**
   * კალათაში დამატება ან ვარიაციების არჩევაზე გადასვლა
   */
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    if (hasVariations) {
      router.push({ pathname: '/product/[slug]', params: { slug } });
      return;
    }

    addItem({ id, name, price: salePrice || price, image: imgSrc, slug, stockQuantity });
  };

  /**
   * სწრაფი ყიდვა ან ვარიაციების არჩევაზე გადასვლა
   */
  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    if (hasVariations) {
      router.push({ pathname: '/product/[slug]', params: { slug } });
      return;
    }

    addItem({ id, name, price: salePrice || price, image: imgSrc, slug, stockQuantity });
    router.push('/checkout');
  };

  /**
   * Wishlist-ში დამატება/ამოღება
   */
  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({ 
      id, name, price, salePrice, regularPrice, image, slug, 
      attributes, stockQuantity, stockStatus, productCategories
    });
  };

  const handleFullView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push({ pathname: '/product/[slug]', params: { slug } });
  };

  return (
    <div 
      className={`group relative flex flex-col w-full h-full bg-white border border-gray-200 rounded-2xl p-3 transition-all duration-300 hover:shadow-xl hover:border-brand-DEFAULT/30 cursor-pointer ${isOutOfStock ? 'opacity-80' : ''} ${className || ''}`}
      onClick={handleFullView}
    >
      
      {/* 1. სურათის სექცია */}
      <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-gray-50 mb-3 border border-gray-100 cursor-pointer">
        
        {/* ფასდაკლების ბეიჯი - მკვეთრი წითელი/ვარდისფერი */}
        {!isOutOfStock && hasDiscount && discountPercent && (
          <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
            <span className="bg-rose-600 text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-sm tracking-wide">
              -{discountPercent}%
            </span>
          </div>
        )}

        {/* Wishlist და QuickView აიკონები - მარჯვენა მხარეს */}
        <div className="absolute top-2.5 right-2.5 z-30 flex flex-col gap-1.5">
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

            <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView?.(e); }}
                className="hidden md:flex p-2 rounded-full bg-white/90 text-gray-600 border border-transparent hover:text-brand-DEFAULT hover:bg-white hover:border-brand-DEFAULT/20 shadow-sm transition-all duration-300 transform translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 backdrop-blur-sm active:scale-95 cursor-pointer"
                title={t('quickView')}
            >
                <Eye className="w-4.5 h-4.5" strokeWidth={2}/>
            </button>
        </div>

        {/* კატეგორიის ბეიჯი - სურათის ქვედა მარცხენა კუთხეში */}
        {categoryName && (
           <div className="absolute bottom-2.5 left-2.5 z-20 pointer-events-none">
             <span className="bg-white/90 backdrop-blur-[4px] text-gray-900 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-sm border border-gray-100/50">
               {categoryName}
             </span>
           </div>
        )}

        {/* მარაგში არ არის - Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
             <div className="bg-black/90 text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-xl">
                <XCircle className="w-3.5 h-3.5" />
                {t('outOfStock')}
             </div>
          </div>
        )}

        {/* სურათები */}
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
      <div className="flex flex-col flex-1 gap-1.5 min-w-0">
        
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
        <div className="flex justify-between items-end mt-auto mb-3 gap-2">
            <div className="flex flex-col gap-0.5 leading-none min-w-0">
                 <span className={`text-[19px] font-bold tracking-tight truncate ${hasDiscount ? 'text-brand-DEFAULT' : 'text-gray-900'}`}>
                   {displayPrice}
                 </span>
                 {hasDiscount && displayOldPrice && (
                   <span className="text-xs text-gray-400 line-through decoration-gray-300 truncate">
                     {displayOldPrice}
                   </span>
                 )}
            </div>

            {/* ფერების სვოტჩები */}
            {colorOptions.length > 0 && !isOutOfStock && (
                <div className="flex -space-x-1.5 pb-1 flex-shrink-0">
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

        {/* 3. ღილაკები - ადაპტირებული მობილურზე და გრძელ ტექსტებზე */}
        <div className="flex gap-2 h-11 w-full min-w-0">
           {isOutOfStock ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-center rounded-xl text-[10px] font-bold uppercase cursor-not-allowed tracking-wider border border-gray-100 px-1 truncate">
                {t('outOfStock')}
              </div>
           ) : (
             <>
               {/* კალათა - მობილურზე მხოლოდ აიკონი */}
               <button
                 onClick={handleAddToCart}
                 className="group/btn flex items-center justify-center w-12 md:w-auto md:flex-1 bg-white text-gray-900 border border-gray-200 rounded-xl hover:border-black hover:bg-gray-50 transition-all active:scale-95 shadow-sm cursor-pointer px-1.5 overflow-hidden"
                 title={hasVariations ? t('selectOptions') : t('addToCart')}
               >
                 <ShoppingBag className="w-5 h-5 md:w-4 md:h-4 flex-shrink-0 md:mr-1.5" />
                 <span className="hidden md:block text-[11px] font-bold uppercase truncate min-w-0">
                    {hasVariations ? t('selectOptions') : t('addToCart')}
                 </span>
               </button>

               {/* ყიდვა - ვარდისფერი, ტექსტით ყველგან */}
               <button
                 onClick={handleBuyNow}
                 className="flex-1 flex items-center justify-center bg-brand-DEFAULT text-white rounded-xl hover:bg-brand-dark transition-all active:scale-95 shadow-sm hover:shadow-brand-DEFAULT/20 cursor-pointer px-2 overflow-hidden gap-1.5"
                 title={t('buyNow')}
               >
                 <CreditCard className="w-4 h-4 flex-shrink-0" />
                 <span className="text-[11px] font-bold uppercase truncate min-w-0">
                   {t('buy')}
                 </span>
               </button>
             </>
           )}
        </div>
      </div>
    </div>
  );
}