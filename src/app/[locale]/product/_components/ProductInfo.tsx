'use client';

import { useState, useMemo } from 'react';
import { useRouter } from '@/navigation';
import { useCartStore } from '@/store/cartStore';
import { 
    Heart, AlertCircle, Minus, Plus, 
    Ruler, Box, Layers, Tag, Info, 
    Truck, Check, CreditCard, Star, Smartphone, Eye, Landmark 
} from 'lucide-react';
import { Product, CartItem } from '@/types';
import AddToCartButton from './AddToCartButton';
import ProductGallery from './ProductGallery';
import { useTranslations } from 'next-intl';

// ... Logo Components (LogoTBC, LogoBOG) დარჩა იგივე ...
const LogoTBC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 105.8 93.2" className="h-6 md:h-8 w-auto">
    <style type="text/css">
        {`.st0{fill:#00A3E0;stroke:#FFFFFF;stroke-width:0.5;stroke-miterlimit:10;}`}
    </style>
    <path className="st0" d="M98.6,93.2H7.4c-4,0-5.2-0.9,1.8-3.2C19.3,86.4,33,79.5,48.3,67.5c3.6-2.8,5.8-3.6,10.9-2.5 c16.4,4.5,31.6,14,40.9,20.8c4.1,3,4.9,4.2,4.2,5.7c-0.4,0.9-1.8,1.5-5.9,1.5"/>
    <path className="st0" d="M53.6,0.1c1.2-0.5,2.6,0.8,4,3.3c0.7,1.2,45.2,78.3,46.7,80.8c3.2,5.4,1,3.7-3.1,0.4c-8.2-7-21.9-16-40.2-23.3 c-4.8-2-5.9-3.7-7.2-7.8C49.2,36,50.2,16.8,51.5,5.4C51.9,2.4,52.4,0.7,53.6,0.1"/>
    <path className="st0" d="M1.5,84.6C14.2,62.7,46.7,6.5,48.2,3.8c4.1-7,2.1-0.2,1.6,2.7c-1.9,10.6-3,27.3-0.3,46.6c0.7,5,0,6.9-3.3,10.7 C33.3,76.5,16,85.2,5.7,89.7c-3,1.3-4.6,1.2-5.2,0.4C-0.3,89.3-0.2,87.7,1.5,84.6"/>
  </svg>
);

const LogoBOG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48.07 42.07" className="h-7 md:h-9 w-auto">
    <path fill="#e6e7e8" d="M33,0H13.64A11.4,11.4,0,0,0,2.26,11.38V30.69A11.4,11.4,0,0,0,13.64,42.07H33A11.39,11.39,0,0,0,44.32,30.69V11.38A11.39,11.39,0,0,0,33,0m7.67,30.69A7.68,7.68,0,0,1,33,38.36H13.64a7.68,7.68,0,0,1-7-4.63l.67-.59,1.41-4L6,24.55V11.38a7.68,7.68,0,0,1,7.67-7.67H33a7.68,7.68,0,0,1,7.67,7.67Z"/>
    <path fill="#ff671d" d="M36.23,30a4.28,4.28,0,0,0,1.36.2c2.06,0,3-.82,3-1.79,0-1.14-1.55-1.14-1.71-2.14-.2-1.25-.07-6.79,2.08-9.85l1.44.65a1.78,1.78,0,0,0,.9.2,1.36,1.36,0,0,0,1-.5,30.28,30.28,0,0,0,3.76-5.18c.18-.36-2.85-4.14-4.54-5.51A6.78,6.78,0,0,0,32.88,9.08a32.29,32.29,0,0,1-9.61,4.56c-4.64,1.22-9.44.08-12.7.25A6.56,6.56,0,0,0,4,20.73c.11,3.62,2.59,6.91,2.59,10.3a3.72,3.72,0,0,1-3.65,3.84c-1.79,0-1.9-.73-2.45-.73a.48.48,0,0,0-.47.47c0,.9,2.2,1.76,3.45,1.76A5.51,5.51,0,0,0,8.19,34a4.17,4.17,0,0,0,4.15,2.47c2.62,0,3.76-1.26,3.76-2.31,0-.85-.51-1.21-.89-1.71a2.86,2.86,0,0,1-.5-1.58,10.13,10.13,0,0,0,1.43.09c1.91,0,2.49-.77,2.49-1.53,0-1-1.14-.91-1.14-2.52,0-1.22.68-1.62,1.27-1.62s3.08.23,6,.53c1,.1,3.44,1.06,3.44,4.87V32c0,2.33.94,5.21,5.05,5.21,2.79,0,4.36-1.56,4.36-2.68,0-.74-.64-1.06-1-1.5A4.22,4.22,0,0,1,36.21,30"/>
    <g fill="#fff">
        <path d="M43,13.28a.49.49,0,1,0,.49.49.49.49,0,0,0-.49-.49"/><path d="M44.69,11.86a.44.44,0,0,0,0,.88.44.44,0,1,0,0-.88"/><path d="M45.48,10.23a.37.37,0,0,0,0,.73.37.37,0,1,0,0-.73"/><path d="M31.59,12.53a.52.52,0,0,0,.53-.52.53.53,0,0,0-.53-.53.52.52,0,0,0-.52.53.52.52,0,0,0,.52.52"/><path d="M33.61,25.22a.53.53,0,1,0,.52.52.52.52,0,0,0-.52-.52"/><path d="M36.73,25.74a.53.53,0,0,0,0,1.05.53.53,0,1,0,0-1.05"/><path d="M34,20.45a.53.53,0,0,0,0,1.05.53.53,0,1,0,0-1.05"/><path d="M35.83,16.9a.52.52,0,0,0,.53-.52.53.53,0,0,0-.53-.53.52.52,0,0,0-.52.53.52.52,0,0,0,.52.52"/><path d="M27.65,14.78a.53.53,0,1,0-.52-.52.53.53,0,0,0,.52.52"/><path d="M30.59,24.14a.53.53,0,0,0-.53.53.53.53,0,0,0,1.05,0,.53.53,0,0,0-.52-.53"/><path d="M29.14,17.36a.52.52,0,0,0,.52-.52.52.52,0,0,0-.52-.53.53.53,0,0,0-.52.53.52.52,0,0,0,.52.52"/><path d="M25.83,20.35a.52.52,0,0,0,0,1.52.52,0,1,0,0-1"/><path d="M31.25,19.79a.53.53,0,0,0,.53-.53.52.52,0,0,0-.53-.52.52.52,0,0,0-.52.52.52.52,0,0,0,.52.53"/><path d="M23,15.09a.53.53,0,1,0,.52.53.52.52,0,0,0-.52-.53"/><path d="M24.11,17.81a.52.52,0,0,0-.52.52.52.52,0,1,0,1,0,.52.52,0,0,0-.52-.52"/><path d="M28,22.38a.52.52,0,0,0-.52.53.52.52,0,0,0,1,0,.52.52,0,0,0-.52-.53"/><path d="M33.34,15a.52.52,0,1,0-.53-.52.52.52,0,0,0,.53.52"/><path d="M37.19,21.45a.52.52,0,0,0-.52.53.52.52,0,1,0,1,0,.52.52,0,0,0-.52-.53"/><path d="M38.51,17.18a.52.52,0,1,0,.52.52.52.52,0,0,0-.52-.52"/><path d="M38.17,12.87a.52.52,0,0,0-.53.52.53.53,0,1,0,1,0,.52.52,0,0,0-.52-.52"/><path d="M40.66,13.67a.53.53,0,1,0,0,1.05.53.53,0,0,0,0-1.05"/><path d="M36.3,11.25a.52.52,0,1,0,0,1.52.52,0,0,0,0-1"/><path d="M35.27,9.27a.53.53,0,1,0,0,1.05.53.53,0,0,0,0-1.05"/><path d="M37.44,9.27a.53.53,0,1,0,0,1.05.53.53,0,0,0,0-1.05"/><path d="M35,7.84a.44.44,0,1,1,.44.44A.44.44,0,0,1,35,7.84"/><path d="M36.26,6.25a.33.33,0,1,1,.33.33.33.33,0,0,1-.33-.33"/><path d="M38,5.49a.29.29,0,0,1,.58,0,.29.29,0,0,1-.58,0"/><path d="M45.15,9.11a.27.27,0,1,1,.27.26.26.26,0,0,1-.27-.26"/><path d="M44.78,14.35a.3.3,0,0,1,.28-.3.28.28,0,0,1,.29.28.27.27,0,0,1-.27.29.28.28,0,0,1-.3-.27"/><path d="M45.52,13.34a.29.29,0,0,1,.27-.3.28.28,0,0,1,.3.27.28.28,0,0,1-.27.3.28.28,0,0,1-.3-.27"/><path d="M44,15.35a.3.3,0,0,1,.28-.3.28.28,0,0,1,.29.28.27.27,0,0,1-.27.29.28.28,0,0,1-.3-.27"/><path d="M43.11,16.29a.28.28,0,0,1,.27-.3.3.3,0,0,1,.3.28.28.28,0,0,1-.28.29.27.27,0,0,1-.29-.27"/><path d="M46.2,12.33a.3.3,0,0,1,.28-.3.29.29,0,0,1,.29.28.28.28,0,0,1-.27.3.3.3,0,0,1-.3-.28"/><path d="M46.73,11.45a.28.28,0,0,1,.27-.3.28.28,0,0,1,.3.27.29.29,0,0,1-.28.3.27.27,0,0,1-.29-.27"/><path d="M14,33.59a8.48,8.48,0,0,1-.59-6.71c1.46-3.76,5.67-3.27,5.67-3.27a4.74,4.74,0,0,0-2.22-.43,5.53,5.53,0,0,0-5.07,6A5.91,5.91,0,0,0,14,33.59"/><path d="M6.93,23A4.54,4.54,0,0,1,5.6,19.81a4.64,4.64,0,0,1,4.55-4.55c2.59-.14,7.34.63,10.37.24,1.05,4.68,5.69,9.22,9.34,11.29-4.33-1.93-8.48-6.31-12.1-8.32-3.78-2.1-7.57-2.41-9.57-.58A5.18,5.18,0,0,0,6.93,23"/><path d="M17.64,27.75c.23,1.35-2.2,1.78-2.2,1.78,2.22.4,3-.79,3-.79Z"/><path d="M35.26,28.48v0s-1.44,2.05-.45,5.77a6.58,6.58,0,0,1-2.57,1.3s3.34.43,4.38-1.34c-2-1.57-1.41-5.45-1.37-5.71"/><path d="M41.92,7.15a2.22,2.22,0,0,0-2.71,1.53,2.43,2.43,0,0,0,4.71.86,2.22,2.22,0,0,0-2-2.39m1.63,2.3a1.73,1.73,0,0,1-3.34-.61,1.73,1.73,0,0,1,3.34.61"/><path d="M41.8,9.12a1,1,0,0,1,1.85.33,1,1,0,0,1-1.85-.33"/><path d="M39.09,26.63h0c.79,1.48-1.77,2-1.77,2,1.78.3,2.8-.85,2.8-1.32-.38-1.61-.8-.39-1-.72"/><path d="M44.44,8.33A3.77,3.77,0,0,0,38.1,8a.61.61,0,1,1-.94-.77A4.41,4.41,0,0,1,40.45,5.8a4.35,4.35,0,0,1,4,2.53"/><path d="M40.37,16.07a8.83,8.83,0,0,1-4.67-1.89,9.57,9.57,0,0,1-2.92-3.29.41.41,0,0,1,.15-.55.39.39,0,0,1,.55.14A10.75,10.75,0,0,0,36.24,14a9.41,9.41,0,0,0,4.13,2.05"/><path d="M38.59,19.73a11.66,11.66,0,0,1-7.33-3.6A11.93,11.93,0,0,1,29,12.89a.39.39,0,0,1,.16-.54.38.38,0,0,1,.54.16,13.69,13.69,0,0,0,2.7,4,10.77,10.77,0,0,0,6.21,3.19"/><path d="M25,14.24a.41.41,0,0,1,.51.25,14.74,14.74,0,0,0,3.56,5.71,13.21,13.21,0,0,0,8.67,3.88,13.19,13.19,0,0,1-9.41-3.91,15.41,15.41,0,0,1-3.58-5.42.4.4,0,0,1,.25-.51"/><path d="M39.19,11.13a4.45,4.45,0,0,0,2.33.73,2.85,2.85,0,0,0,3-2.34,3.24,3.24,0,0,1-3.3,2.92,4.45,4.45,0,0,1-2.4-.58.41.41,0,0,1,.36-.73"/>
    </g>
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
  const t = useTranslations('Product');
  
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

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
  
  // 🆕 SKU-ს განსაზღვრა (ვარიაციიდან ან მთავარი პროდუქტიდან)
  const displaySku = selectedVariation?.sku || product.sku;

  useMemo(() => {
    if (displayStockQuantity !== undefined && quantity > displayStockQuantity) {
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
  };
  
  const cartDataForButton = { ...itemBase, quantity };
  
  const isProductOutOfStock = displayStock !== 'IN_STOCK' || (displayStockQuantity !== undefined && displayStockQuantity === 0);
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

  const colorMap: Record<string, string> = { 
    'shavi': '#000000', 'შავი': '#000000',
    'tetri': '#FFFFFF', 'თეთრი': '#FFFFFF',
    'lurji': '#2563EB', 'ლურჯი': '#2563EB',
    'muqi_lurji': '#1E3A8A', 'მუქი ლურჯი': '#1E3A8A',
    'cisferi': '#60A5FA', 'ცისფერი': '#60A5FA',
    'beji': '#F5F5DC', 'ბეჟი': '#F5F5DC',
    'yavisferi': '#8B4513', 'ყავისფერი': '#8B4513',
    'vardisferi': '#DB2777', 'ვარდისფერი': '#DB2777',
    'witeli': '#DC2626', 'წითელი': '#DC2626',
    'mwvane': '#16A34A', 'მწვანე': '#16A34A',
    'narinjisferi': '#F97316', 'ნარინჯისფერი': '#F97316',
    'yviteli': '#FACC15', 'ყვითელი': '#FACC15',
    'rcuxi': '#9CA3AF', 'რუხი': '#9CA3AF',
    'vercxlisferi': '#C0C0C0', 'oqrosferi': '#FFD700', 'iasamnisferi': '#A855F7', 'kanisferi': '#FFE4C4', 
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
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-brand-dark transition cursor-pointer cursor-pointer">
                    {product.productCategories?.nodes[0]?.name || 'Collection'}
                </span>
                {/* 🆕 SKU-ს გამოჩენა აქ */}
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

        {/* 🆕 განახლებული Reviews (მხოლოდ ვარსკვლავები) */}
        <div className="flex items-center gap-2 mb-6">
            <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            {/* ტექსტი წაშლილია */}
        </div>

        <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">{t('priceLabel')}</span>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl lg:text-3xl font-serif font-black text-brand-dark">
                        {displayPrice?.includes('₾') ? displayPrice : `${displayPrice} ₾`}
                    </span>
                    {isSale && regularPrice && (
                        <span className="text-xs text-gray-400 line-through decoration-red-400 decoration-1">
                            {regularPrice}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
                <button 
                    onClick={handleBuyNow}
                    disabled={isBuyNowDisabled}
                    className="flex-1 sm:flex-none bg-black text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-brand-DEFAULT transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed h-12 cursor-pointer"
                >
                    <CreditCard className="w-4 h-4" /> {t('buyNow')}
                </button>
                
                <button className="h-12 w-12 flex items-center justify-center bg-white border border-gray-200 rounded-xl hover:border-red-200 hover:text-red-500 transition shadow-sm group active:scale-90 cursor-pointer">
                    <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
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
                <span className="flex-1 text-center font-bold text-lg text-brand-dark">{isProductOutOfStock ? 0 : quantity}</span>
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

        <div className="grid grid-cols-3 gap-2 md:gap-3 mb-8">
            
            <div className="border border-brand-light bg-brand-light/30 rounded-2xl p-2 md:p-3 flex flex-col items-center text-center justify-center transition-all hover:shadow-md hover:border-brand-medium cursor-default h-full min-h-[110px]">
                <span className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">{t('Payment.onlineTitle')}</span>
                <div className="flex items-center justify-center gap-2 mb-2 scale-90">
                    <LogoTBC />
                    <span className="text-gray-300">|</span>
                    <LogoBOG />
                </div>
                <div className="text-[8px] md:text-[9px] text-brand-DEFAULT font-bold bg-white px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                    {t('Payment.onlineTime')}
                </div>
            </div>

            <div className="border border-gray-100 bg-gray-50 rounded-2xl p-2 md:p-3 flex flex-col items-center text-center justify-center transition-all hover:shadow-md hover:border-gray-200 cursor-default h-full min-h-[110px]">
                <span className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">გადარიცხვა</span>
                <div className="mb-2 text-gray-600">
                    <Landmark className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="text-[8px] md:text-[9px] text-gray-500 font-medium leading-tight">
                    გადახდა საბანკო<br/>გადარიცხვით / ინტერნეტ ბანკით
                </div>
            </div>

            <div className="border border-gray-100 bg-gray-50 rounded-2xl p-2 md:p-3 flex flex-col items-center text-center justify-center transition-all hover:shadow-md hover:border-gray-200 cursor-default h-full min-h-[110px]">
                <span className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">{t('Payment.courierTitle')}</span>
                <div className="mb-2 text-gray-600">
                    <Smartphone className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="text-[8px] md:text-[9px] text-gray-500 font-medium leading-tight">
                    {t('Payment.courierDesc')}
                </div>
            </div>
        </div>

        <div className="border-t border-gray-100 my-6"></div>

        <div className="space-y-6">
            
            <div 
                className="bg-gray-50 p-5 rounded-2xl text-gray-600 text-sm leading-relaxed border border-gray-100" 
                dangerouslySetInnerHTML={{ __html: product.shortDescription || 'აღწერა არ არის.' }} 
            />

            {technicalAttributes.length > 0 && (
                <div className="bg-white rounded-2xl p-1">
                    <h4 className="font-bold text-brand-dark mb-4 text-xs uppercase tracking-widest flex items-center gap-2 opacity-60">
                        <Info className="w-4 h-4" /> დეტალური მახასიათებლები
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

        </div>
      </div>
    </div>
  );
}