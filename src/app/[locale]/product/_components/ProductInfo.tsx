// src/app/[locale]/product/_components/ProductInfo.tsx

'use client';

import { useState, useMemo } from 'react';
import { Heart, Star, Truck, ShieldCheck, RefreshCcw, Minus, Plus } from 'lucide-react';
import { Product } from '@/types';
import AddToCartButton from './AddToCartButton';
import ProductGallery from './ProductGallery';

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  
  // ✅ განახლებული ლოგიკა
  const selectedVariation = useMemo(() => {
    if (!product.variations) return null;
    return product.variations.nodes.find((variation) => {
      return variation.attributes?.nodes.every((attr) => {
        // ვადარებთ პირდაპირ value-ს (რადგან query-ში შევცვალეთ)
        return selectedOptions[attr.name] === attr.value;
      });
    });
  }, [product.variations, selectedOptions]);

  const displayPrice = selectedVariation?.price || product.price;
  const displayImage = selectedVariation?.image?.sourceUrl || product.image?.sourceUrl || '/placeholder.jpg';
  const displayStock = selectedVariation?.stockStatus || product.stockStatus;
  
  const isSimpleProduct = !product.variations;
  const allOptionsSelected = product.attributes 
    ? product.attributes.nodes.length === Object.keys(selectedOptions).length 
    : true;
  
  const isValidSelection = isSimpleProduct || (allOptionsSelected && !!selectedVariation);

  const cartData = {
    id: selectedVariation ? selectedVariation.databaseId : product.databaseId,
    name: selectedVariation ? `${product.name} - ${selectedVariation.name}` : product.name,
    price: displayPrice,
    image: displayImage,
    slug: product.slug,
    selectedOptions: selectedOptions,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20">
      
      {/* მარცხენა მხარე: გალერეა */}
      <div className="lg:sticky lg:top-32 h-min relative">
        <ProductGallery 
            mainImage={displayImage} 
            gallery={product.galleryImages?.nodes.map(img => img.sourceUrl) || []} 
            alt={product.name}
        />
        <button className="absolute top-6 right-6 bg-white p-4 rounded-full shadow-lg hover:text-brand-DEFAULT transition hover:scale-110 z-10 hidden lg:block text-brand-dark">
            <Heart className="w-6 h-6" />
        </button>
      </div>

      {/* მარჯვენა მხარე: ინფორმაცია */}
      <div className="flex flex-col justify-center py-4">
        
        <h1 className="text-4xl md:text-6xl font-serif font-black text-brand-dark mb-6 leading-tight">
            {product.name}
        </h1>
        
        <div className="flex items-center gap-6 mb-8">
            <span className="text-4xl font-black text-brand-dark">
                {/* ფასის სიმბოლოს დამატება თუ აკლია */}
                {displayPrice?.includes('₾') ? displayPrice : `${displayPrice} ₾`}
            </span>
            <div className="h-8 w-[1px] bg-gray-200"></div>
            <div className="flex items-center gap-1 text-yellow-400">
                <Star className="w-5 h-5 fill-current" />
                <span className="text-brand-dark font-bold text-lg ml-1">4.9</span>
                <span className="text-gray-400 text-sm font-normal">(128 შეფასება)</span>
            </div>
        </div>

        <div 
            className="text-gray-600 leading-relaxed mb-10 text-lg font-light" 
            dangerouslySetInnerHTML={{ __html: product.shortDescription || '<p>აღწერა არ არის.</p>' }} 
        />
        
        {/* ატრიბუტების არჩევა */}
        {!isSimpleProduct && product.attributes && (
            <div className="mb-10">
                {product.attributes.nodes.map((attr) => (
                    <div key={attr.name} className="mb-6">
                        <span className="text-xs font-bold uppercase tracking-widest text-brand-dark mb-4 block">
                            {attr.label || attr.name}
                        </span>
                        <div className="flex flex-wrap gap-4">
                            {attr.options?.map((option) => {
                                const isSelected = selectedOptions[attr.name] === option;
                                
                                // ფერის ვიზუალი
                                if (attr.name.toLowerCase().includes('color') || attr.name.toLowerCase().includes('ფერი')) {
                                    const colorMap: Record<string, string> = { 'red': '#DC2626', 'black': '#000000', 'white': '#FFFFFF', 'blue': '#2563EB', 'brown': '#8B5E3C' };
                                    const bg = colorMap[option.toLowerCase()] || '#E5E7EB';
                                    return (
                                        <button
                                            key={option}
                                            onClick={() => setSelectedOptions(prev => ({...prev, [attr.name]: option}))}
                                            className={`w-14 h-14 rounded-full border-4 border-white shadow-lg transition transform ${isSelected ? 'ring-2 ring-brand-DEFAULT scale-110' : 'ring-1 ring-gray-200 hover:scale-105'}`}
                                            style={{ backgroundColor: bg }}
                                            title={option}
                                        />
                                    );
                                }
                                
                                return (
                                    <button
                                        key={option}
                                        onClick={() => setSelectedOptions(prev => ({...prev, [attr.name]: option}))}
                                        className={`px-6 py-3 rounded-xl font-bold border transition ${isSelected ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-brand-dark border-gray-200 hover:border-brand-dark'}`}
                                    >
                                        {option}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        )}

        <div className="flex gap-4 border-t border-gray-100 pt-10">
            <div className="flex items-center bg-gray-50 rounded-full h-16 px-2 w-40 justify-between shadow-inner">
                <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm hover:text-brand-DEFAULT transition"
                >
                    <Minus className="w-5 h-5" />
                </button>
                <span className="font-bold text-xl">{quantity}</span>
                <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm hover:text-brand-DEFAULT transition"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>
            
            <AddToCartButton 
                product={{ ...cartData, quantity }}
                stockStatus={displayStock} 
                disabled={!isValidSelection} 
            />
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-6 mt-12">
            <div className="flex flex-col items-center text-center gap-3 p-6 bg-white rounded-3xl border border-gray-100 shadow-lg hover:-translate-y-1 transition">
                <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center">
                    <Truck className="w-6 h-6 text-brand-DEFAULT" />
                </div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">უფასო მიწოდება</span>
            </div>
            <div className="flex flex-col items-center text-center gap-3 p-6 bg-white rounded-3xl border border-gray-100 shadow-lg hover:-translate-y-1 transition">
                <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-brand-DEFAULT" />
                </div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">1 წლიანი გარანტია</span>
            </div>
            <div className="flex flex-col items-center text-center gap-3 p-6 bg-white rounded-3xl border border-gray-100 shadow-lg hover:-translate-y-1 transition">
                <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center">
                    <RefreshCcw className="w-6 h-6 text-brand-DEFAULT" />
                </div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">მარტივი დაბრუნება</span>
            </div>
        </div>
      </div>
    </div>
  );
}