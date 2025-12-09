'use client';

import { useState, useMemo } from 'react';
// დავამატეთ: ShieldCheck, CreditCard, Banknote, RefreshCcw
import { Heart, AlertCircle, Minus, Plus, Share2, Ruler, Box, Layers, Tag, Info, Truck, ShieldCheck, Banknote, RefreshCcw, Check } from 'lucide-react';
import { Product } from '@/types';
import AddToCartButton from './AddToCartButton';
import ProductGallery from './ProductGallery';
// import ProductDetails from './ProductDetails';  <-- ეს აღარ გვჭირდება
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-20 animate-fade-in">
      
      {/* --- მარცხენა მხარე (გალერეა) --- */}
      <div className="lg:col-span-7 h-min sticky top-32">
        <ProductGallery 
            mainImage={displayImage} 
            gallery={product.galleryImages?.nodes.map(img => img.sourceUrl) || []} 
            alt={product.name}
        />
      </div>

      {/* --- მარჯვენა მხარე (ინფო) --- */}
      <div className="lg:col-span-5 flex flex-col py-2">
        
        {/* HEADER */}
        <div className="flex justify-between items-start mb-6">
            <div>
                <div className="flex items-center gap-3 mb-2">
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
            <button className="p-3 bg-white border border-gray-100 rounded-full hover:bg-brand-light hover:text-brand-DEFAULT transition shadow-sm group">
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

        {/* --- ACTIONS BLOCK (Color, Qty, AddToCart) --- */}
        <div className="space-y-6 mb-10">
            
            {/* Color Selection */}
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

            {/* Qty & Button Container */}
            <div className="flex gap-3">
                <div className="flex items-center bg-gray-50 rounded-2xl h-14 px-1 w-36 justify-between border border-gray-200">
                    <button 
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="w-10 h-full flex items-center justify-center hover:text-brand-DEFAULT transition active:scale-90 text-gray-400"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-lg text-brand-dark">{quantity}</span>
                    <button 
                        onClick={() => setQuantity(q => q + 1)}
                        className="w-10 h-full flex items-center justify-center hover:text-brand-DEFAULT transition active:scale-90 text-gray-400"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
                
                <div className="flex-1">
                    <AddToCartButton 
                        product={{ ...cartData, quantity }}
                        stockStatus={displayStock} 
                        disabled={!isValidSelection} 
                    />
                </div>
            </div>
        </div>

        {/* --- INFO ZONE --- */}
        <div className="space-y-8 mt-8">
            
            {/* მოკლე აღწერა */}
            <div 
                className="text-gray-600 leading-relaxed text-sm md:text-base font-light" 
                dangerouslySetInnerHTML={{ __html: product.shortDescription || '' }} 
            />

            {/* მახასიათებლები */}
            {technicalAttributes.length > 0 && (
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                    <h4 className="font-bold text-brand-dark mb-4 text-xs uppercase tracking-widest flex items-center gap-2 opacity-70">
                        <Info className="w-4 h-4" /> დეტალური მახასიათებლები
                    </h4>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                        <div className="flex flex-col border-r border-gray-200 pr-2 last:border-0">
                            <span className="text-[10px] text-gray-400 font-bold uppercase mb-1">SKU</span>
                            <span className="text-sm font-bold text-brand-dark">#{product.databaseId}</span>
                        </div>
                        {technicalAttributes.map((attr) => (
                            <div key={attr.name} className="flex flex-col border-r border-gray-200 pr-2 last:border-0 nth-2n:border-0">
                                <span className="text-[10px] text-gray-400 font-bold uppercase mb-1 truncate">
                                    {attr.label || attr.name}
                                </span>
                                <span className="text-sm font-bold text-brand-dark truncate">
                                    {attr.options?.join(', ')}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ✅ ახალი: TRUST & SERVICE BLOCK (აკორდეონის ნაცვლად) */}
            <div className="space-y-3 pt-4">
                
                {/* 1. მიწოდება */}
                <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-brand-medium/50 hover:bg-brand-light/20 transition-all duration-300 group">
                    <div className="bg-brand-light text-brand-DEFAULT p-3 rounded-full group-hover:scale-110 transition-transform">
                        <Truck className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-brand-dark text-sm mb-1">სწრაფი და უფასო მიწოდება</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            200₾-ის ზემოთ შეკვეთებზე მიწოდება უფასოა მთელი საქართველოს მასშტაბით.
                            <span className="block mt-1 text-brand-dark font-medium">თბილისი: 1-2 დღე | რეგიონები: 2-4 დღე</span>
                        </p>
                    </div>
                </div>

                {/* 2. უსაფრთხო გადახდა */}
                <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50/50 transition-all duration-300 group">
                    <div className="bg-green-50 text-green-600 p-3 rounded-full group-hover:scale-110 transition-transform">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-brand-dark text-sm mb-1">დაცული გადახდა</h4>
                        <p className="text-xs text-gray-500 leading-relaxed mb-2">
                            გადაიხადეთ უსაფრთხოდ ნებისმიერი ბანკის ბარათით.
                        </p>
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-brand-dark bg-white border border-gray-200 px-2 py-1 rounded w-fit">
                            <Banknote className="w-3 h-3 text-green-600" />
                            ასევე: პირდაპირი გადარიცხვა
                        </div>
                    </div>
                </div>

                {/* 3. გარანტია/დაბრუნება */}
                <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300 group">
                    <div className="bg-blue-50 text-blue-600 p-3 rounded-full group-hover:scale-110 transition-transform">
                        <RefreshCcw className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-brand-dark text-sm mb-1">ხარისხის გარანტია</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            ყველა პროდუქტი გადის ხარისხის კონტროლს. მოქმედებს მარტივი დაბრუნების პოლიტიკა.
                        </p>
                    </div>
                </div>

            </div>

        </div>
      </div>
    </div>
  );
}