'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from '@/navigation';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { 
    Heart, AlertCircle, Minus, Plus, 
    Ruler, Box, Layers, Tag, Info, 
    Truck, Check, CreditCard, Eye, Landmark, Star, Camera,
    ChevronDown, ChevronUp 
} from 'lucide-react';
import { Product, CartItem } from '@/types';
import AddToCartButton from './AddToCartButton';
import ProductGallery from './ProductGallery';
import { useTranslations } from 'next-intl';

// Logo Components (TBC, BOG, Visa, Mastercard)
const LogoTBC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 105.8 93.2" className="h-6 md:h-8 w-auto">
    <style type="text/css">
        {`.st0{fill:#00A3E0;stroke:#FFFFFF;stroke-width:0.5;stroke-miterlimit:10;}`}
    </style>
    <path className="st0" d="M98.6,93.2H7.4c-4,0-5.2-0.9,1.8-3.2C19.3,86.4,33,79.5,48.3,67.5c3.6-2.8,5.8-3.6,10.9-2.5 c16.4,4.5,31.6,14,40.9,20.8c4.1,3,4.9,4.2,4.2,5.7c-0.4,0.9-1.8,1.5-5.9,1.5"/>
    <path className="st0" d="M53.6,0.1c1.2-0.5,2.6,0.8,4,3.3c0.7,1.2,45.2,78.3,46.7,80.8c3.2,5.4,1,3.7-3.1,0.4c-8.2-7-21.9-16-40.2-23.3 c-4.8-2-5.9-3.7-7.2-7.8C49.2,36,50.2,16.8,51.5,5.4C51.9,2.4,52.4,0.7,53.6,0.1"/>
    <path className="st0" d="M1.5,84.6C14.2,62.7,46.7,6.5,48.2,3.8c4.1-7,2.1-0.2,1.6,2.7c-1.9,10.6-3,27.3-0.3,46.6c0.7,5,0,6.9-3.3,10.7 C33.3,76.5,16,85.2,5.7,89.7c-3,1.3-4.6,1.2-5.2,0.4C-0.3,89.3-0.2,87.7,1.5,84.6"/>
  </svg>
);

const LogoBOG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48.07 42.07" className="h-6 md:h-8 w-auto">
    <path fill="#e6e7e8" d="M33,0H13.64A11.4,11.4,0,0,0,2.26,11.38V30.69A11.4,11.4,0,0,0,13.64,42.07H33A11.39,11.39,0,0,0,44.32,30.69V11.38A11.39,11.39,0,0,0,33,0m7.67,30.69A7.68,7.68,0,0,1,33,38.36H13.64a7.68,7.68,0,0,1-7-4.63l.67-.59,1.41-4L6,24.55V11.38a7.68,7.68,0,0,1,7.67-7.67H33a7.68,7.68,0,0,1,7.67,7.67Z"/>
    <path fill="#ff671d" d="M36.23,30a4.28,4.28,0,0,0,1.36.2c2.06,0,3-.82,3-1.79,0-1.14-1.55-1.14-1.71-2.14-.2-1.25-.07-6.79,2.08-9.85l1.44.65a1.78,1.78,0,0,0,.9.2,1.36,1.36,0,0,0,1-.5,30.28,30.28,0,0,0,3.76-5.18c.18-.36-2.85-4.14-4.54-5.51A6.78,6.78,0,0,0,32.88,9.08a32.29,32.29,0,0,1-9.61,4.56c-4.64,1.22-9.44.08-12.7.25A6.56,6.56,0,0,0,4,20.73c.11,3.62,2.59,6.91,2.59,10.3a3.72,3.72,0,0,1-3.65,3.84c-1.79,0-1.9-.73-2.45-.73a.48.48,0,0,0-.47.47c0,.9,2.2,1.76,3.45,1.76A5.51,5.51,0,0,0,8.19,34a4.17,4.17,0,0,0,4.15,2.47c2.62,0,3.76-1.26,3.76-2.31,0-.85-.51-1.21-.89-1.71a2.86,2.86,0,0,1-.5-1.58,10.13,10.13,0,0,0,1.43.09c1.91,0,2.49-.77,2.49-1.53,0-1-1.14-.91-1.14-2.52,0-1.22.68-1.62,1.27-1.62s3.08.23,6,.53c1,.1,3.44,1.06,3.44,4.87V32c0,2.33.94,5.21,5.05,5.21,2.79,0,4.36-1.56,4.36-2.68,0-.74-.64-1.06-1-1.5A4.22,4.22,0,0,1,36.21,30"/>
  </svg>
);

const LogoMastercard = () => (
  <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" className="h-6 md:h-8 w-auto" aria-labelledby="pi-master">
    <title id="pi-master">Mastercard</title>
    <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path>
    <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path>
    <circle fill="#EB001B" cx="15" cy="12" r="7"></circle>
    <circle fill="#F79E1B" cx="23" cy="12" r="7"></circle>
    <path fill="#FF5F00" d="M22 12c0-2.4-1.2-4.5-3-5.7-1.8 1.3-3 3.4-3 5.7s1.2 4.5 3 5.7c1.8-1.2 3-3.3 3-5.7z"></path>
  </svg>
);

const LogoVisa = () => (
  <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" className="h-6 md:h-8 w-auto" aria-labelledby="pi-visa">
    <title id="pi-visa">Visa</title>
    <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path>
    <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path>
    <path d="M28.3 10.1H28c-.4 1-.7 1.5-1 3h1.9c-.3-1.5-.3-2.2-.6-3zm2.9 5.9h-1.7c-.1 0-.1 0-.2-.1l-.2-.9-.1-.2h-2.4c-.1 0-.2 0-.2.2l-.3.9c0 .1-.1.1-.1.1h-2.1l.2-.5L27 8.7c0-.5.3-.7.8-.7h1.5c.1 0 .2 0 .2.2l1.4 6.5c.1.4.2.7.2 1.1.1.1.1.1.1.2zm-13.4-.3l.4-1.8c.1 0 .2.1.2.1.7.3 1.4.5 2.1.4.2 0 .5-.1.7-.2.5-.2.5-.7.1-1.1-.2-.2-.5-.3-.8-.5-.4-.2-.8-.4-1.1-.7-1.2-1-.8-2.4-.1-3.1.6-.4.9-.8 1.7-.8 1.2 0 2.5 0 3.1.2h.1c-.1.6-.2 1.1-.4 1.7-.5-.2-1-.4-1.5-.4-.3 0-.6 0-.9.1-.2 0-.3.1-.4.2-.2.2-.2.5 0 .7l.5.4c.4.2.8.4 1.1.6.5.3 1 .8 1.1 1.4.2.9-.1 1.7-.9 2.3-.5.4-.7.6-1.4.6-1.4 0-2.5.1-3.4-.2-.1.2-.1.2-.2.1zm-3.5.3c.1-.7.1-.7.2-1 .5-2.2 1-4.5 1.4-6.7.1-.2.1-.3.3-.3H18c-.2 1.2-.4 2.1-.7 3.2-.3 1.5-.6 3-1 4.5 0 .2-.1.2-.3.2M5 8.2c0-.1.2-.2.3-.2h3.4c.5 0 .9.3 1 .8l.9 4.4c0 .1 0 .1.1.2 0-.1.1-.1.1-.1l2.1-5.1c-.1-.1 0-.2.1-.2h2.1c0 .1 0 .1-.1.2l-3.1 7.3c-.1.2-.1.3-.2.4-.1.1-.3 0-.5 0H9.7c-.1 0-.2 0-.2-.2L7.9 9.5c-.2-.2-.5-.5-.9-.6-.6-.3-1.7-.5-1.9-.5L5 8.2z" fill="#142688"></path>
  </svg>
);

interface ProductInfoProps {
  product: Product;
  locale?: string;
}

const getAttributeIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('zoma') || lowerName.includes('size') || lowerName.includes('სიმაღლე') || lowerName.includes('სიგანე')) return <Ruler className="w-4 h-4 text-brand-DEFAULT" />;
    if (lowerName.includes('masala') || lowerName.includes('material')) return <Layers className="w-4 h-4 text-brand-DEFAULT" />;
    if (lowerName.includes('sku') || lowerName.includes('kodi')) return <Tag className="w-4 h-4 text-brand-DEFAULT" />;
    if (lowerName.includes('xarisxi') || lowerName.includes('quality')) return <Check className="w-4 h-4 text-brand-DEFAULT" />;
    return <Box className="w-4 h-4 text-brand-DEFAULT" />;
};

export default function ProductInfo({ product, locale = 'ka' }: ProductInfoProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [isDescOpen, setIsDescOpen] = useState(false);
  const t = useTranslations('Product');
  
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const attributes = product.attributes?.nodes || [];
  
  const colorAttribute = attributes.find(attr => 
    attr.name.toLowerCase().includes('color') || 
    attr.name.toLowerCase().includes('pa_color') ||
    attr.name.includes('ფერი')
  );

  useMemo(() => {
    if (colorAttribute && !selectedColor && colorAttribute.options && colorAttribute.options.length > 0) {
      setSelectedColor(colorAttribute.options[0]);
    }
  }, [colorAttribute, selectedColor]);

  const technicalAttributes = attributes.filter(attr => attr !== colorAttribute);

  const selectedVariation = useMemo(() => {
    if (!product.variations || !selectedColor) return null;
    return product.variations.nodes.find((variation) => {
      return variation.attributes?.nodes.some(attr => 
        (attr.name.includes('color') || attr.name.includes('ფერი')) && attr.value === selectedColor
      );
    });
  }, [product.variations, selectedColor]);

  const colorOptions = useMemo(() => {
    if (!colorAttribute) return [];
    if (colorAttribute.terms?.nodes?.length) {
        return colorAttribute.terms.nodes.map(term => ({
            name: term.name,
            slug: term.slug,
            value: term.slug
        }));
    }
    return colorAttribute.options?.map(opt => ({
        name: opt,
        slug: opt,
        value: opt
    })) || [];
  }, [colorAttribute]);

  const selectedColorName = useMemo(() => {
      const name = colorOptions.find(c => c.value === selectedColor)?.name;
      return name || (selectedColor && typeof selectedColor === 'string' ? selectedColor : null);
  }, [colorOptions, selectedColor]);
  
  const safeSelectedColorName = selectedColorName || undefined;
  
  const displayPrice = selectedVariation?.price || product.price;
  const regularPrice = selectedVariation?.regularPrice || product.regularPrice;
  const isSale = selectedVariation?.salePrice || product.salePrice;
  const displayImage = selectedVariation?.image?.sourceUrl || product.image?.sourceUrl || '/placeholder.jpg';
  const displayStock = selectedVariation?.stockStatus || product.stockStatus;
  const displayStockQuantity = selectedVariation?.stockQuantity || product.stockQuantity;
  
  const displaySku = selectedVariation 
    ? (selectedVariation.sku || undefined) 
    : product.sku;

  const isProductOutOfStock = displayStock !== 'IN_STOCK' || (displayStockQuantity !== undefined && displayStockQuantity === 0);

  // ✅ ახალი ლოგიკა: რაოდენობის სინქრონიზაცია მარაგთან
  useEffect(() => {
    if (isProductOutOfStock) {
      setQuantity(0);
    } else {
      // თუ მარაგშია და რაოდენობა 0-ია (ან ცარიელია), ავტომატურად დავაყენოთ 1
      if (quantity === 0) {
        setQuantity(1);
      }
    }
  }, [isProductOutOfStock, quantity]);

  // მაქსიმალური რაოდენობის შემოწმება
  useEffect(() => {
    if (displayStockQuantity !== undefined && displayStockQuantity > 0 && quantity > displayStockQuantity) {
        setQuantity(displayStockQuantity);
    }
  }, [displayStockQuantity, quantity]);

  const finalSelectedOptions: Record<string, string> | undefined = safeSelectedColorName 
    ? { Color: safeSelectedColorName } 
    : undefined;

  const itemBase: Omit<CartItem, 'quantity'> = {
    id: selectedVariation ? selectedVariation.databaseId : product.databaseId,
    name: selectedVariation 
      ? `${product.name}${safeSelectedColorName ? ` - ${safeSelectedColorName}` : ''}`
      : product.name,
    price: displayPrice || '0 ₾',
    image: displayImage || '/placeholder.jpg',
    slug: product.slug,
    stockQuantity: displayStockQuantity,
    selectedOptions: finalSelectedOptions,
    sku: displaySku,
  };
  
  const cartDataForButton = { ...itemBase, quantity };
  
  const isValidSelection = !product.variations || !!selectedVariation;
  const isBuyNowDisabled = !isValidSelection || isProductOutOfStock || quantity === 0;

  const handleBuyNow = () => {
      if(!isBuyNowDisabled) {
          for(let i = 0; i < quantity; i++) {
              addItem(itemBase); 
          }
          router.push('/checkout');
      }
  };

  const handleWishlist = () => {
    toggleItem({
      id: product.databaseId,
      name: product.name,
      price: product.price || '0 ₾',
      salePrice: product.salePrice,
      regularPrice: product.regularPrice,
      image: product.image?.sourceUrl || '/placeholder.jpg',
      slug: product.slug,
      stockQuantity: product.stockQuantity
    });
  };

  const isLiked = mounted ? isInWishlist(product.databaseId) : false;

// ✅ განახლებული ColorMap ყველა ენისთვის
  const colorMap: Record<string, string> = { 
    'shavi': '#000000', 'black-en': '#000000', 'chernyj-ru': '#000000', 'შავი': '#000000',
    'tetri': '#FFFFFF', 'white-en': '#FFFFFF', 'belyj-ru': '#FFFFFF', 'თეთრი': '#FFFFFF',
    'lurji': '#2563EB', 'blue-en': '#2563EB', 'sinij-ru': '#2563EB', 'ლურჯი': '#2563EB',
    'witeli': '#DC2626', 'red-en': '#DC2626', 'krasnyj-ru': '#DC2626', 'წითელი': '#DC2626',
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
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 animate-fade-in pb-10">
      
      <div className="lg:col-span-6 h-min lg:sticky lg:top-32 z-10">
        <ProductGallery 
            mainImage={displayImage} 
            gallery={product.galleryImages?.nodes.map(img => img.sourceUrl) || []} 
            alt={product.name}
        />
      </div>

      <div className="lg:col-span-6 flex flex-col py-2">
        
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-brand-dark transition cursor-pointer">
                    {product.productCategories?.nodes[0]?.name || 'Collection'}
                </span>
                {displaySku && (
                    <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded uppercase tracking-wider">
                        SKU: {displaySku}
                    </span>
                )}
            </div>
            
            {isProductOutOfStock ? (
                <span className="flex items-center gap-1.5 text-red-500 text-[10px] font-bold uppercase bg-red-50 px-2 py-1 rounded-full">
                    <AlertCircle className="w-3 h-3" /> {t('outOfStock')}
                </span>
            ) : (
                <span className="flex items-center gap-1.5 text-green-600 text-[10px] font-bold uppercase bg-green-50 px-2 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> {t('inStock')}
                </span>
            )}
        </div>

        <h1 className="text-2xl md:text-3xl font-serif font-bold text-brand-dark leading-tight mb-3 tracking-tight">
            {product.name}
        </h1>

        <div className="flex items-center gap-2 mb-6">
            <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
        </div>

        <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">{t('priceLabel')}</span>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl lg:text-3xl font-serif font-black text-brand-dark">
                        {displayPrice?.includes('₾') ? displayPrice : `${displayPrice} ₾`}
                    </span>
                    {regularPrice && isSale && (
                        <span className="text-xs text-gray-400 line-through decoration-red-400 decoration-1">
                            {regularPrice}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
                {!isProductOutOfStock && (
                    <button 
                        onClick={handleBuyNow}
                        disabled={isBuyNowDisabled}
                        className="flex-1 sm:flex-none bg-black text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-brand-DEFAULT transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap h-12 cursor-pointer"
                    >
                        <CreditCard className="w-4 h-4" /> {t('buyNow')}
                    </button>
                )}
                
                <button 
                  onClick={handleWishlist}
                  className={`h-12 w-12 flex items-center justify-center border rounded-xl transition shadow-sm group active:scale-90 cursor-pointer ${
                    isLiked 
                      ? 'bg-red-50 border-red-200 text-red-500' 
                      : 'bg-white border-gray-200 hover:border-red-200 hover:text-red-500'
                  }`}
                >
                    <Heart className={`w-5 h-5 group-hover:scale-110 transition-transform ${isLiked ? 'fill-current' : ''}`} />
                </button>
            </div>
        </div>

        {colorOptions.length > 0 && (
            <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-brand-dark uppercase tracking-wider">
                        {t('color')}: <span className="text-gray-500 font-normal capitalize">{selectedColorName}</span>
                    </span>
                </div>
                <div className="flex flex-wrap gap-3">
                    {colorOptions.map((option) => {
                        const isSelected = selectedColor === option.value;
                        const bg = colorMap[option.slug.toLowerCase().replace(/\s+/g, '_')] || '#E5E7EB';
                        
                        return (
                            <button
                                key={option.value}
                                onClick={() => setSelectedColor(option.value)}
                                className={`
                                    w-10 h-10 rounded-full shadow-sm transition-all duration-300 relative cursor-pointer
                                    ${isSelected 
                                    ? 'ring-2 ring-offset-2 ring-brand-dark scale-110' 
                                    : 'hover:scale-105 border border-gray-200'
                                    }
                                `}
                                style={{ backgroundColor: bg }}
                                title={option.name}
                            />
                        );
                    })}
                </div>
            </div>
        )}

        <div className="flex gap-3 mb-8 pb-4">
            <div className="flex items-center bg-white rounded-xl h-14 border border-gray-200 w-32 shadow-sm">
                <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                    disabled={isProductOutOfStock || quantity <= 1}
                    className="w-10 h-full flex items-center justify-center hover:text-brand-DEFAULT transition active:scale-90 text-gray-400 cursor-pointer disabled:opacity-50"
                >
                    <Minus className="w-4 h-4" />
                </button>
                {/* ✅ გარანტია: თუ მარაგშია, აჩვენოს რაოდენობა (დეფოლტად 1), წინააღმდეგ შემთხვევაში 0 */}
                <span className="flex-1 text-center font-bold text-lg text-brand-dark">
                    {isProductOutOfStock ? 0 : (quantity || 1)}
                </span>
                <button 
                    onClick={() => setQuantity(q => q + 1)} 
                    disabled={isProductOutOfStock || (displayStockQuantity !== undefined && quantity >= displayStockQuantity)} 
                    className="w-10 h-full flex items-center justify-center hover:text-brand-DEFAULT transition active:scale-90 text-gray-400 cursor-pointer disabled:opacity-50"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>
            
            <div className="flex-1">
                <AddToCartButton 
                    product={cartDataForButton}
                    stockStatus={displayStock} 
                    disabled={!isValidSelection} 
                />
            </div>
        </div>

        {/* Payment Blocks */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-8">
            <div className="col-span-2 border border-brand-light bg-brand-light/30 rounded-2xl p-2 md:p-3 flex flex-col items-center text-center justify-center transition-all hover:shadow-md hover:border-brand-medium h-full min-h-[110px]">
                <span className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">{t('Payment.onlineTitle')}</span>
                <div className="flex items-center justify-center gap-4 mb-2">
                    <LogoTBC />
                    <LogoBOG />
                    <LogoVisa />
                    <LogoMastercard />
                </div>
                <div className="text-[8px] md:text-[9px] text-brand-DEFAULT font-bold bg-white px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                    {t('Payment.onlineTime')}
                </div>
            </div>

            <div className="col-span-1 border border-gray-100 bg-gray-50 rounded-2xl p-2 md:p-3 flex flex-col items-center text-center justify-center transition-all hover:shadow-md hover:border-gray-200 h-full min-h-[110px]">
                <span className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">გადარიცხვა</span>
                <div className="mb-2 text-gray-600">
                    <Landmark className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="text-[8px] md:text-[9px] text-gray-500 font-medium leading-tight">
                    გადახდა საბანკო<br/>გადარიცხვით
                </div>
            </div>

            <div className="col-span-1 border border-gray-100 bg-gray-50 rounded-2xl p-2 md:p-3 flex flex-col items-center text-center justify-center transition-all hover:shadow-md hover:border-gray-200 cursor-default h-full min-h-[110px]">
                <span className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">რეალური ფოტოები</span>
                <div className="mb-2 text-brand-DEFAULT">
                    <Camera className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="text-[8px] md:text-[9px] text-gray-500 font-medium leading-tight">
                    პროდუქცია 100%-ით<br/>შეესაბამება ფოტოებს
                </div>
            </div>
        </div>

        <div className="border-t border-gray-100 my-6"></div>

        <div className="space-y-6">
            <div className="space-y-3">
                <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-brand-light transition-colors">
                    <div className="bg-brand-light text-brand-DEFAULT p-3 rounded-full flex-shrink-0"><Truck className="w-5 h-5" /></div>
                    <div>
                        <h4 className="font-bold text-brand-dark text-sm mb-1">{t('Services.deliveryTitle')}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            {t('Services.deliveryDesc')}<br/>
                            <span className="text-brand-DEFAULT font-bold">{t('Services.freeShipping')}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-blue-100 transition-colors">
                    <div className="bg-blue-50 text-blue-600 p-3 rounded-full flex-shrink-0"><Eye className="w-5 h-5" /></div>
                    <div>
                        <h4 className="font-bold text-brand-dark text-sm mb-1">{t('Services.checkTitle')}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            {t('Services.checkDesc')}
                        </p>
                    </div>
                </div>
            </div>

            {technicalAttributes.length > 0 && (
                <div className="bg-white rounded-2xl p-1">
                    <h4 className="font-bold text-brand-dark mb-4 text-xs uppercase tracking-widest flex items-center gap-2 opacity-60">
                        <Layers className="w-4 h-4" /> დეტალური მახასიათებლები
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                        {technicalAttributes.map((attr) => {
                            const label = attr.label || attr.name;
                            const value = attr.terms?.nodes?.length 
                                ? attr.terms.nodes.map(t => t.name).join(', ')
                                : attr.options?.join(', ');

                            return (
                                <div key={attr.name} className="bg-gray-50 border border-gray-100 p-3 rounded-xl flex items-start gap-3">
                                    <div className="text-brand-DEFAULT">{getAttributeIcon(attr.name)}</div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase truncate" title={label}>{label}</span>
                                        <span className="text-sm font-bold text-brand-dark truncate">{value}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                <button 
                    onClick={() => setIsDescOpen(!isDescOpen)}
                    className="w-full p-5 flex items-center justify-between font-bold text-brand-dark text-sm uppercase tracking-widest hover:bg-gray-100/50 transition-colors"
                >
                    <span className="flex items-center gap-2"><Info className="w-4 h-4 opacity-60" /> პროდუქტის აღწერა</span>
                    {isDescOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                
                {isDescOpen && (
                    <div 
                        className="px-5 pb-5 text-gray-600 text-sm leading-relaxed animate-slide-down" 
                        dangerouslySetInnerHTML={{ __html: product.shortDescription || 'აღწერა არ არის.' }} 
                    />
                )}
            </div>

        </div>
      </div>
    </div>
  );
}