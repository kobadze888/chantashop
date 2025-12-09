'use client';

import { useState, useMemo } from 'react';
import { useRouter } from '@/navigation';
import { useCartStore } from '@/store/cartStore';
import { 
    Heart, AlertCircle, Minus, Plus, 
    Ruler, Box, Layers, Tag, Info, 
    Truck, ShieldCheck, Banknote, RefreshCcw, Check, CreditCard, Star 
} from 'lucide-react';
import { Product } from '@/types';
import AddToCartButton from './AddToCartButton';
import ProductGallery from './ProductGallery';
import { useTranslations } from 'next-intl';

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

  const displayPrice = selectedVariation?.price || product.price;
  const regularPrice = selectedVariation?.regularPrice || product.regularPrice;
  const isSale = selectedVariation?.salePrice || product.salePrice;
  const displayImage = selectedVariation?.image?.sourceUrl || product.image?.sourceUrl || '/placeholder.jpg';
  const displayStock = selectedVariation?.stockStatus || product.stockStatus;
  
  const cartData = {
    id: selectedVariation ? selectedVariation.databaseId : product.databaseId,
    name: selectedVariation ? `${product.name} - ${selectedColor}` : product.name,
    price: displayPrice,
    image: displayImage,
    slug: product.slug,
    selectedOptions: selectedColor ? { Color: selectedColor } : {},
  };

  const isValidSelection = !product.variations || !!selectedVariation;

  const handleBuyNow = () => {
      if(isValidSelection && displayStock === 'IN_STOCK') {
          addItem({ ...cartData, quantity });
          router.push('/checkout');
      }
  };

  const colorMap: Record<string, string> = { 
    'shavi': '#000000', 'tetri': '#FFFFFF', 'lurji': '#2563EB', 
    'cisferi': '#60A5FA', 'beji': '#F5F5DC', 'yavisferi': '#8B4513', 
    'vardisferi': '#DB2777', 'witeli': '#DC2626', 'mwvane': '#16A34A',
    'narinjisferi': '#F97316', 'yviteli': '#FACC15', 'rcuxi': '#9CA3AF',
    'vardisferi_(pradas_stili)': '#DB2777' 
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 animate-fade-in pb-10">
      
      {/* --- მარცხენა მხარე: გალერეა (შეიცვალა col-span-7 -> col-span-6) --- */}
      <div className="lg:col-span-6 h-min lg:sticky lg:top-32 z-10">
        <ProductGallery 
            mainImage={displayImage} 
            gallery={product.galleryImages?.nodes.map(img => img.sourceUrl) || []} 
            alt={product.name}
        />
      </div>

      {/* --- მარჯვენა მხარე: ინფორმაცია (შეიცვალა col-span-5 -> col-span-6) --- */}
      <div className="lg:col-span-6 flex flex-col py-2">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-brand-dark transition cursor-pointer">
                {product.productCategories?.nodes[0]?.name || 'Collection'}
            </span>
            
            {displayStock === 'IN_STOCK' ? (
                <span className="flex items-center gap-1.5 text-green-600 text-[10px] font-bold uppercase bg-green-50 px-2 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> მარაგშია
                </span>
            ) : (
                <span className="flex items-center gap-1.5 text-red-500 text-[10px] font-bold uppercase bg-red-50 px-2 py-1 rounded-full">
                    <AlertCircle className="w-3 h-3" /> ამოიწურა
                </span>
            )}
        </div>

        {/* TITLE */}
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-brand-dark leading-tight mb-3 tracking-tight">
            {product.name}
        </h1>

        {/* RATING */}
        <div className="flex items-center gap-2 mb-6">
            <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <span className="text-xs text-gray-400 font-medium">(12 შეფასება)</span>
        </div>

        {/* PRICE & BUY NOW BLOCK */}
        <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">ფასი</span>
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
                    disabled={!isValidSelection || displayStock !== 'IN_STOCK'}
                    className="flex-1 sm:flex-none bg-black text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-brand-DEFAULT transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed h-12"
                >
                    <CreditCard className="w-4 h-4" /> იყიდე ახლავე
                </button>
                
                <button className="h-12 w-12 flex items-center justify-center bg-white border border-gray-200 rounded-xl hover:border-red-200 hover:text-red-500 transition shadow-sm group active:scale-90">
                    <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
            </div>
        </div>

        {/* COLOR SELECTION */}
        {colorAttribute && (
            <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-brand-dark uppercase tracking-wider">
                        ფერი: <span className="text-gray-500 font-normal capitalize">{selectedColor}</span>
                    </span>
                </div>
                <div className="flex flex-wrap gap-3">
                    {colorAttribute.options?.map((option) => {
                        const isSelected = selectedColor === option;
                        const bg = colorMap[option.toLowerCase().replace(/\s+/g, '_')] || '#E5E7EB';
                        
                        return (
                            <button
                                key={option}
                                onClick={() => setSelectedColor(option)}
                                className={`
                                    w-10 h-10 rounded-full shadow-sm transition-all duration-300 relative
                                    ${isSelected 
                                    ? 'ring-2 ring-offset-2 ring-brand-dark scale-110' 
                                    : 'hover:scale-105 border border-gray-200'
                                    }
                                `}
                                style={{ backgroundColor: bg }}
                                title={option}
                            />
                        );
                    })}
                </div>
            </div>
        )}

        {/* BOTTOM ACTIONS */}
        <div className="flex gap-3 mb-10 border-b border-gray-100 pb-8">
            <div className="flex items-center bg-white rounded-xl h-14 border border-gray-200 w-32 shadow-sm">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-full flex items-center justify-center hover:text-brand-DEFAULT transition active:scale-90 text-gray-400"><Minus className="w-4 h-4" /></button>
                <span className="flex-1 text-center font-bold text-lg text-brand-dark">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-full flex items-center justify-center hover:text-brand-DEFAULT transition active:scale-90 text-gray-400"><Plus className="w-4 h-4" /></button>
            </div>
            
            <div className="flex-1">
                <AddToCartButton 
                    product={{ ...cartData, quantity }}
                    stockStatus={displayStock} 
                    disabled={!isValidSelection} 
                />
            </div>
        </div>

        {/* INFO & MARKETING */}
        <div className="space-y-8 mt-2">
            <div 
                className="bg-brand-gray/50 p-6 rounded-2xl text-gray-600 text-sm leading-relaxed border border-gray-100/50" 
                dangerouslySetInnerHTML={{ __html: product.shortDescription || 'აღწერა არ არის.' }} 
            />

            {technicalAttributes.length > 0 && (
                <div className="bg-white rounded-2xl p-1">
                    <h4 className="font-bold text-brand-dark mb-4 text-xs uppercase tracking-widest flex items-center gap-2 opacity-60">
                        <Info className="w-4 h-4" /> დეტალური მახასიათებლები
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 border border-gray-100 p-3 rounded-xl flex items-start gap-3">
                            <div className="text-brand-DEFAULT"><Tag className="w-4 h-4" /></div>
                            <div className="flex flex-col"><span className="text-[10px] text-gray-400 font-bold uppercase">SKU</span><span className="text-sm font-bold text-brand-dark">#{product.databaseId}</span></div>
                        </div>
                        {technicalAttributes.map((attr) => (
                            <div key={attr.name} className="bg-gray-50 border border-gray-100 p-3 rounded-xl flex items-start gap-3">
                                <div className="text-brand-DEFAULT">{getAttributeIcon(attr.name)}</div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase truncate" title={attr.label || attr.name}>{attr.label || attr.name}</span>
                                    <span className="text-sm font-bold text-brand-dark truncate">{attr.options?.join(', ')}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-3 pt-2">
                <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-brand-medium/50 hover:bg-brand-light/20 transition-all duration-300 group cursor-default">
                    <div className="bg-brand-light text-brand-DEFAULT p-3 rounded-full group-hover:scale-110 transition-transform"><Truck className="w-5 h-5" /></div>
                    <div>
                        <h4 className="font-bold text-brand-dark text-sm mb-1">სწრაფი და უფასო მიწოდება</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">200₾+ შეკვეთებზე მიწოდება უფასოა.<br/>თბილისი: 1-2 დღე | რეგიონები: 2-4 დღე</p>
                    </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50/50 transition-all duration-300 group cursor-default">
                    <div className="bg-green-50 text-green-600 p-3 rounded-full group-hover:scale-110 transition-transform"><ShieldCheck className="w-5 h-5" /></div>
                    <div>
                        <h4 className="font-bold text-brand-dark text-sm mb-1">დაცული გადახდა</h4>
                        <p className="text-xs text-gray-500 leading-relaxed mb-2">გადაიხადეთ უსაფრთხოდ ნებისმიერი ბარათით.</p>
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-brand-dark bg-white border border-gray-200 px-2 py-1 rounded w-fit">
                            <Banknote className="w-3 h-3 text-green-600" /> პირდაპირი გადარიცხვაც
                        </div>
                    </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300 group cursor-default">
                    <div className="bg-blue-50 text-blue-600 p-3 rounded-full group-hover:scale-110 transition-transform"><RefreshCcw className="w-5 h-5" /></div>
                    <div>
                        <h4 className="font-bold text-brand-dark text-sm mb-1">ხარისხის გარანტია</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">ყველა პროდუქტი გადის შემოწმებას. მოქმედებს დაბრუნების პოლიტიკა.</p>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}