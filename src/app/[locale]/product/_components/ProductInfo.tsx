'use client';

import { useState, useMemo } from 'react';
import { useRouter } from '@/navigation';
import { useCartStore } from '@/store/cartStore';
import { 
    Heart, AlertCircle, Minus, Plus, Share2, 
    Ruler, Box, Layers, Tag, Info, 
    Truck, ShieldCheck, Banknote, RefreshCcw, Check, Zap 
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 animate-fade-in">
      
      <div className="lg:col-span-6 h-min lg:sticky lg:top-32">
        <ProductGallery 
            mainImage={displayImage} 
            gallery={product.galleryImages?.nodes.map(img => img.sourceUrl) || []} 
            alt={product.name}
        />
      </div>

      <div className="lg:col-span-6 flex flex-col py-2">
        
        {/* HEADER */}
        <div className="flex justify-between items-start mb-6">
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <span className="bg-brand-light text-brand-DEFAULT text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {product.productCategories?.nodes[0]?.name || 'Collection'}
                    </span>
                    {displayStock === 'IN_STOCK' ? (
                        <span className="flex items-center gap-1.5 text-green-600 text-[10px] font-bold uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> მარაგშია
                        </span>
                    ) : (
                        <span className="flex items-center gap-1.5 text-red-500 text-[10px] font-bold uppercase">
                            <AlertCircle className="w-3 h-3" /> ამოიწურა
                        </span>
                    )}
                </div>
                <h1 className="text-3xl lg:text-4xl font-serif font-black text-brand-dark leading-tight">
                    {product.name}
                </h1>
            </div>
            <button className="p-3 bg-white border border-gray-100 rounded-full hover:bg-brand-light hover:text-brand-DEFAULT transition shadow-sm group flex-shrink-0">
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
        </div>

        {/* PRICE */}
        <div className="flex items-end gap-3 mb-8 pb-6 border-b border-dashed border-gray-200">
            <span className="text-4xl font-black text-brand-dark tracking-tight">
                {displayPrice?.includes('₾') ? displayPrice : `${displayPrice} ₾`}
            </span>
            {isSale && regularPrice && (
                <span className="text-lg text-gray-400 line-through mb-1.5 decoration-red-400 decoration-2 font-medium">
                    {regularPrice}
                </span>
            )}
        </div>

        {/* ACTIONS BLOCK */}
        <div className="space-y-6 mb-10">
            {colorAttribute && (
                <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 block">
                        არჩეული ფერი: <span className="text-brand-dark ml-1">{selectedColor}</span>
                    </span>
                    <div className="flex flex-wrap gap-3">
                        {colorAttribute.options?.map((option) => {
                            const isSelected = selectedColor === option;
                            const colorMap: Record<string, string> = { 
                                'shavi': '#000000', 'tetri': '#FFFFFF', 'lurji': '#2563EB', 
                                'cisferi': '#60A5FA', 'beji': '#F5F5DC', 'yavisferi': '#8B4513', 
                                'vardisferi': '#DB2777', 'witeli': '#DC2626', 'mwvane': '#16A34A',
                                'vardisferi_(pradas_stili)': '#DB2777' 
                            };
                            const bg = colorMap[option.toLowerCase().replace(/\s+/g, '_')] || '#E5E7EB';
                            
                            return (
                                <button
                                    key={option}
                                    onClick={() => setSelectedColor(option)}
                                    className={`w-12 h-12 rounded-xl shadow-sm transition-all duration-300 flex items-center justify-center relative border-2 ${
                                        isSelected 
                                        ? 'border-brand-DEFAULT scale-110 shadow-md ring-2 ring-brand-light ring-offset-1' 
                                        : 'border-transparent hover:border-gray-200 hover:scale-105'
                                    }`}
                                    style={{ backgroundColor: bg }}
                                    title={option}
                                >
                                    {isSelected && <Check className={`w-5 h-5 drop-shadow-md ${option.toLowerCase().includes('tetri') ? 'text-black' : 'text-white'}`} />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1 flex items-center bg-gray-50 rounded-2xl h-14 justify-between border border-gray-200 px-1">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-full flex items-center justify-center hover:text-brand-DEFAULT transition active:scale-90 text-gray-400"><Minus className="w-4 h-4" /></button>
                    <span className="font-bold text-lg text-brand-dark">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="w-8 h-full flex items-center justify-center hover:text-brand-DEFAULT transition active:scale-90 text-gray-400"><Plus className="w-4 h-4" /></button>
                </div>
                
                <div className="col-span-3 sm:col-span-2">
                    <AddToCartButton 
                        product={{ ...cartData, quantity }}
                        stockStatus={displayStock} 
                        disabled={!isValidSelection} 
                    />
                </div>

                <button 
                    onClick={handleBuyNow}
                    disabled={!isValidSelection || displayStock !== 'IN_STOCK'}
                    className="col-span-4 sm:col-span-1 h-14 rounded-2xl font-bold bg-white border-2 border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-xs shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Zap className="w-4 h-4" /> ყიდვა
                </button>
            </div>
        </div>

        {/* --- INFO ZONE --- */}
        <div className="space-y-8 mt-4">
            
            {/* Description */}
            <div 
                className="bg-brand-gray/50 p-6 rounded-2xl text-gray-600 text-sm leading-relaxed border border-gray-100/50" 
                dangerouslySetInnerHTML={{ __html: product.shortDescription || 'აღწერა არ არის.' }} 
            />

            {/* ✅ TRUST & SERVICE (ავწიეთ ზემოთ) */}
            <div className="space-y-3 pt-2">
                <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-brand-medium/50 hover:bg-brand-light/20 transition-all duration-300 group cursor-default">
                    <div className="bg-brand-light text-brand-DEFAULT p-3 rounded-full group-hover:scale-110 transition-transform"><Truck className="w-5 h-5" /></div>
                    <div>
                        <h4 className="font-bold text-brand-dark text-sm mb-1">უფასო მიწოდება 200₾+</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">თბილისი: 1-2 დღე | რეგიონები: 2-4 დღე.<br/>სწრაფი და საიმედო კურიერული მომსახურება.</p>
                    </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50/50 transition-all duration-300 group cursor-default">
                    <div className="bg-green-50 text-green-600 p-3 rounded-full group-hover:scale-110 transition-transform"><ShieldCheck className="w-5 h-5" /></div>
                    <div>
                        <h4 className="font-bold text-brand-dark text-sm mb-1">უსაფრთხო გადახდა</h4>
                        <p className="text-xs text-gray-500 leading-relaxed mb-2">გადაიხადეთ ბარათით ან პირდაპირი გადარიცხვით.</p>
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-50 border border-green-100 px-2 py-1 rounded w-fit">
                            <Banknote className="w-3 h-3" /> გარანტირებული უსაფრთხოება
                        </div>
                    </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300 group cursor-default">
                    <div className="bg-blue-50 text-blue-600 p-3 rounded-full group-hover:scale-110 transition-transform"><RefreshCcw className="w-5 h-5" /></div>
                    <div>
                        <h4 className="font-bold text-brand-dark text-sm mb-1">ხარისხის გარანტია</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">ყველა ნივთი გადის ხარისხის კონტროლს.</p>
                    </div>
                </div>
            </div>

            {/* ✅ Attributes Grid (ჩამოვიდა ქვემოთ) */}
            {technicalAttributes.length > 0 && (
                <div className="bg-white rounded-2xl">
                    <h4 className="font-bold text-brand-dark mb-4 text-xs uppercase tracking-widest flex items-center gap-2 opacity-60">
                        <Info className="w-4 h-4" /> დეტალები
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

        </div>
      </div>
    </div>
  );
}