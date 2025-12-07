'use client';

import { useState, useMemo, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Product, Variation } from '@/types';
import AddToCartButton from './AddToCartButton';
import ProductGallery from './ProductGallery';
import ProductOptions from './ProductOptions';

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  // 1. მდგომარეობა არჩეული ოფციებისთვის (მაგ: { pa_color: "Red", pa_size: "M" })
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  
  // 2. ვპოულობთ შესაბამის ვარიაციას არჩეული ოფციების მიხედვით
  const selectedVariation = useMemo(() => {
    if (!product.variations) return null;

    return product.variations.nodes.find((variation) => {
      return variation.attributes?.nodes.every((attr) => {
        // ვარიაციის ატრიბუტი უნდა ემთხვეოდეს მომხმარებლის არჩეულს
        return selectedOptions[attr.name] === attr.value;
      });
    });
  }, [product.variations, selectedOptions]);

  // 3. თუ ვარიაცია არჩეულია, ვიყენებთ მის მონაცემებს, თუ არა - მთავარ პროდუქტს
  const displayPrice = selectedVariation ? selectedVariation.price : product.price;
  const displayRegularPrice = selectedVariation ? selectedVariation.regularPrice : product.regularPrice;
  const displayImage = selectedVariation?.image?.sourceUrl || product.image?.sourceUrl || '/placeholder.jpg';
  const displayStock = selectedVariation ? selectedVariation.stockStatus : product.stockStatus;
  
  // 4. ვალიდაცია: ღილაკი აქტიურია, თუ ეს მარტივი პროდუქტია, ან თუ ყველა ოფცია არჩეულია და ვარიაცია მოიძებნა
  const isSimpleProduct = !product.variations;
  const allOptionsSelected = product.attributes 
    ? product.attributes.nodes.length === Object.keys(selectedOptions).length 
    : true;
  
  const isValidSelection = isSimpleProduct || (allOptionsSelected && !!selectedVariation);

  // მონაცემები კალათისთვის
  const cartData = {
    id: selectedVariation ? selectedVariation.databaseId : product.databaseId,
    name: selectedVariation ? `${product.name} - ${selectedVariation.name}` : product.name,
    price: displayPrice,
    image: displayImage,
    slug: product.slug,
    selectedOptions: selectedOptions,
  };

  const handleOptionChange = (attributeName: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [attributeName]: value,
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* გალერეა: იცვლება ვარიაციის მიხედვით */}
      <div className="lg:sticky lg:top-32 h-min">
        <ProductGallery 
            mainImage={displayImage} 
            gallery={product.galleryImages?.nodes.map(img => img.sourceUrl) || []} 
            alt={product.name}
        />
      </div>

      <div className="flex flex-col gap-6">
        <h1 className="text-4xl md:text-5xl font-black text-mocha-dark leading-tight">{product.name}</h1>
        
        {/* ფასი */}
        <div className="flex items-center gap-4">
          {displayRegularPrice && displayRegularPrice !== displayPrice ? (
            <>
              <span className="text-red-600 line-through text-xl opacity-70">{displayRegularPrice}</span>
              <span className="text-mocha-DEFAULT text-3xl font-black">{displayPrice}</span>
            </>
          ) : (
            <p className="text-3xl font-black text-mocha-DEFAULT">{displayPrice}</p>
          )}
        </div>

        {/* მარაგი */}
        <div className={`text-sm font-bold tracking-wider ${displayStock === 'IN_STOCK' ? 'text-green-600' : 'text-red-600'}`}>
            {displayStock === 'IN_STOCK' ? 'მარაგშია 🟢' : 'მარაგში არ არის 🔴'}
        </div>

        <div className="my-4 pt-4 border-t border-mocha-medium/30">
            <h3 className="text-lg font-bold mb-2 text-mocha-dark">მოკლე აღწერა</h3>
            <div 
                className="text-mocha-dark/80 text-base leading-relaxed" 
                dangerouslySetInnerHTML={{ __html: product.shortDescription || '<p>აღწერა არ არის.</p>' }} 
            />
        </div>

        {/* ოფციები (მხოლოდ ვარიაციული პროდუქტებისთვის) */}
        {!isSimpleProduct && product.attributes && (
            <ProductOptions 
                attributes={product.attributes.nodes}
                selectedOptions={selectedOptions}
                onChange={handleOptionChange}
            />
        )}

        {/* ღილაკები */}
        <div className="flex gap-4 items-center">
            <AddToCartButton 
                product={cartData} 
                stockStatus={displayStock} 
                disabled={!isValidSelection} // ღილაკი გათიშულია, სანამ ყველაფერს არ აირჩევენ
            />
            
            <button 
              className="bg-white text-mocha-dark p-4 rounded-full border border-mocha-medium/50 hover:bg-mocha-medium/20 transition active:scale-95 shadow-md group"
              aria-label="Add to Wishlist"
            >
              <Heart className="w-5 h-5 group-hover:text-red-500 transition-colors" />
            </button>
        </div>

        <div className="mt-8 pt-6 border-t border-mocha-medium/30">
            <h3 className="text-lg font-bold mb-3 text-mocha-dark">დეტალური აღწერა</h3>
            <div 
                className="prose max-w-none text-mocha-dark/80 prose-headings:text-mocha-dark prose-a:text-mocha-DEFAULT" 
                dangerouslySetInnerHTML={{ __html: product.description || '<p>დეტალური აღწერა არ არის.</p>' }} 
            />
        </div>
      </div>
    </div>
  );
}