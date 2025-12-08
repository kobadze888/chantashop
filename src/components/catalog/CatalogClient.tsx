// src/components/catalog/CatalogClient.tsx

'use client';

import { useState, useMemo, useEffect } from 'react';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import type { Product, Category, FilterTerm } from '@/types';

interface CatalogClientProps {
  initialProducts: Product[];
  categories: Category[];
  colors: FilterTerm[];
  sizes: FilterTerm[];
  locale: string;
}

// ფასის დამუშავება
const parsePrice = (priceString: string | undefined): number => {
  if (!priceString) return 0;
  // 1. თუ არის "45.00"
  // 2. თუ არის "20.00, 40.00" (ვარიაციული)
  const prices = priceString.split(',').map(p => parseFloat(p.trim()));
  return Math.min(...prices) || 0;
};

export default function CatalogClient({ initialProducts, categories, colors, sizes, locale }: CatalogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(2000); // გაზრდილი ლიმიტი
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // დიაგნოსტიკისთვის: კონსოლში ნახავთ რა მონაცემები მოვიდა
  useEffect(() => {
    console.log('Products:', initialProducts);
    console.log('Filters:', { categories, colors, sizes });
  }, [initialProducts, categories, colors, sizes]);

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      
      // 1. კატეგორია
      const categoryMatch = selectedCategory === 'all' 
        ? true 
        : product.productCategories?.nodes.some(c => c.slug === selectedCategory);

      // 2. ფერი
      const colorMatch = selectedColor === 'all'
        ? true
        : product.attributes?.nodes.some(attr => 
            // ამოწმებს, შეიცავს თუ არა ატრიბუტის ოფციები არჩეული ფერის სახელს (Name)
            attr.options?.includes(colors.find(c => c.slug === selectedColor)?.name || 'UNKNOWN')
          );

      // 3. მასალა (ზომა)
      const sizeMatch = selectedSize === 'all'
        ? true
        : product.attributes?.nodes.some(attr => 
            attr.options?.includes(sizes.find(s => s.slug === selectedSize)?.name || 'UNKNOWN')
          );

      // 4. ფასი
      const productPrice = parsePrice(product.price);
      // თუ ფასი 0-ია (მაგ: არასწორი მონაცემი), მაინც ვაჩვენებთ, რომ არ გაქრეს
      const priceMatch = productPrice > 0 ? productPrice <= maxPrice : true;

      return categoryMatch && colorMatch && sizeMatch && priceMatch;
    });
  }, [initialProducts, selectedCategory, selectedColor, selectedSize, maxPrice, colors, sizes]);

  const getColorBg = (name: string) => {
    const map: Record<string, string> = { 'Black': '#000', 'White': '#fff', 'Red': '#dc2626', 'Blue': '#2563eb' };
    return map[name] || '#e5e7eb';
  };

  return (
    <>
      <div className="container mx-auto px-4 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-100 pb-8">
              <div>
                  <span className="text-brand-DEFAULT text-xs font-bold tracking-widest uppercase mb-2 block">2025</span>
                  <h1 className="text-4xl md:text-6xl font-serif font-black text-brand-dark">
                    {locale === 'ka' ? 'სრული კატალოგი' : 'Catalog'}
                  </h1>
                  <p className="text-gray-400 mt-2 text-sm">
                    ნაპოვნია {filteredProducts.length} პროდუქტი
                  </p>
              </div>
              
              <div className="flex gap-4 w-full md:w-auto">
                  <button 
                    onClick={() => setMobileFiltersOpen(true)}
                    className="md:hidden flex-1 bg-gray-100 text-brand-dark py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition"
                  >
                      <SlidersHorizontal className="w-5 h-5" /> {locale === 'ka' ? 'ფილტრაცია' : 'Filter'}
                  </button>
                  {/* სორტირება ვიზუალურია ჯერჯერობით */}
                  <div className="relative flex-1 md:flex-none">
                      <select className="w-full md:w-auto appearance-none bg-white border border-gray-200 text-brand-dark py-3 px-6 pr-10 rounded-xl font-bold outline-none focus:border-brand-DEFAULT cursor-pointer shadow-sm">
                          <option>{locale === 'ka' ? 'პოპულარობით' : 'Popularity'}</option>
                          <option>{locale === 'ka' ? 'ფასი: ზრდადობით' : 'Price: Low to High'}</option>
                          <option>{locale === 'ka' ? 'ფასი: კლებადობით' : 'Price: High to Low'}</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
              </div>
          </div>
      </div>

      <div className="container mx-auto px-4 flex gap-12 relative">
        
        {/* MOBILE FILTER OVERLAY */}
        <div 
            className={`fixed inset-0 bg-black/60 z-[80] md:hidden transition-opacity duration-300 ${mobileFiltersOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} 
            onClick={() => setMobileFiltersOpen(false)}
        >
            <div 
                className={`absolute right-0 top-0 bottom-0 w-[80%] bg-white p-6 overflow-y-auto transition-transform duration-300 ${mobileFiltersOpen ? 'translate-x-0' : 'translate-x-full'}`} 
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-8">
                    <h3 className="font-serif font-bold text-2xl">{locale === 'ka' ? 'ფილტრაცია' : 'Filter'}</h3>
                    <button onClick={() => setMobileFiltersOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                {/* Mobile Content Duplicated Logic (Simplified for brevity in response) */}
                <div className="space-y-8">
                     {/* ... Same as Desktop logic below ... */}
                     <button onClick={() => setMobileFiltersOpen(false)} className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold mt-8">
                        {locale === 'ka' ? 'შედეგების ჩვენება' : 'Show Results'}
                    </button>
                </div>
            </div>
        </div>

        {/* SIDEBAR (DESKTOP) */}
        <aside className="hidden md:block w-1/4 space-y-10 sticky top-32 h-fit">
            
            {/* Categories */}
            <div>
                <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-brand-dark border-b border-gray-100 pb-2">
                    {locale === 'ka' ? 'კატეგორიები' : 'Categories'}
                </h4>
                <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                            type="radio" 
                            name="category"
                            checked={selectedCategory === 'all'}
                            onChange={() => setSelectedCategory('all')}
                            className="accent-brand-DEFAULT w-5 h-5"
                        />
                        <span className="text-gray-600 group-hover:text-brand-dark transition font-medium">
                            {locale === 'ka' ? 'ყველა' : 'All'}
                        </span>
                    </label>

                    {categories.map((cat) => (
                        <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                            <input 
                                type="radio"
                                name="category"
                                checked={selectedCategory === cat.slug}
                                onChange={() => setSelectedCategory(cat.slug)}
                                className="accent-brand-DEFAULT w-5 h-5"
                            />
                            <span className="text-gray-600 group-hover:text-brand-dark transition font-medium">{cat.name}</span>
                            {cat.count && <span className="ml-auto text-xs text-gray-400 font-bold bg-gray-50 px-2 py-1 rounded">{cat.count}</span>}
                        </label>
                    ))}
                </div>
            </div>

            {/* Colors */}
            {colors.length > 0 && (
                <div>
                    <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-brand-dark border-b border-gray-100 pb-2">
                        {locale === 'ka' ? 'ფერი' : 'Color'}
                    </h4>
                    <div className="flex flex-wrap gap-3">
                        <button
                             onClick={() => setSelectedColor('all')}
                             className={`px-3 py-1 text-xs border rounded-full ${selectedColor === 'all' ? 'bg-brand-dark text-white' : 'bg-white'}`}
                        >All</button>
                        {colors.map((color) => (
                            <button
                                key={color.id}
                                onClick={() => setSelectedColor(selectedColor === color.slug ? 'all' : color.slug)}
                                className={`w-8 h-8 rounded-full shadow-sm transition-transform hover:scale-110 border ${
                                    selectedColor === color.slug 
                                        ? 'ring-2 ring-brand-DEFAULT ring-offset-2 border-transparent scale-110' 
                                        : 'border-gray-200'
                                }`}
                                style={{ backgroundColor: getColorBg(color.name) }}
                                title={color.name}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Sizes (Materials) */}
            {sizes.length > 0 && (
                <div>
                    <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-brand-dark border-b border-gray-100 pb-2">
                        {locale === 'ka' ? 'მასალა' : 'Material'}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        <button
                             onClick={() => setSelectedSize('all')}
                             className={`px-3 py-1 text-xs border rounded-lg ${selectedSize === 'all' ? 'bg-brand-dark text-white' : 'bg-white'}`}
                        >All</button>
                        {sizes.map((size) => (
                            <button
                                key={size.id}
                                onClick={() => setSelectedSize(selectedSize === size.slug ? 'all' : size.slug)}
                                className={`px-4 py-2 text-xs font-bold rounded-lg border transition ${
                                    selectedSize === size.slug
                                        ? 'bg-brand-dark text-white border-brand-dark'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-brand-dark'
                                }`}
                            >
                                {size.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Price Range */}
            <div>
                <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-brand-dark border-b border-gray-100 pb-2">
                    {locale === 'ka' ? 'ფასი' : 'Price'}
                </h4>
                <div className="px-2">
                    <input 
                        type="range" 
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-DEFAULT" 
                        min="0" 
                        max="2000" 
                        step="10"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                    />
                    <div className="flex justify-between mt-3 text-sm font-bold text-gray-500">
                        <span>0 ₾</span>
                        <span>{maxPrice} ₾</span>
                    </div>
                </div>
            </div>
        </aside>

        {/* PRODUCT GRID */}
        <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 md:gap-8">
                {filteredProducts.map((product) => (
                    <ProductCard 
                        key={product.databaseId}
                        id={product.databaseId}
                        name={product.name}
                        // ფასი: ვცდილობთ ნედლი რიცხვი ვაჩვენოთ, ან რაც მოდის
                        price={product.price ? `${parsePrice(product.price)} ₾` : ''}
                        salePrice={product.salePrice}
                        regularPrice={product.regularPrice}
                        image={product.image?.sourceUrl}
                        secondImage={product.galleryImages?.nodes[0]?.sourceUrl}
                        slug={product.slug}
                        locale={locale}
                    />
                ))}
            </div>
            
            {filteredProducts.length === 0 && (
                <div className="text-center py-20 text-gray-400 flex flex-col items-center">
                    <p>{locale === 'ka' ? 'პროდუქტები არ მოიძებნა.' : 'No products found.'}</p>
                    <button 
                        onClick={() => {setSelectedCategory('all'); setSelectedColor('all'); setSelectedSize('all'); setMaxPrice(2000);}}
                        className="mt-4 text-brand-DEFAULT hover:underline font-bold"
                    >
                        {locale === 'ka' ? 'ფილტრების გასუფთავება' : 'Clear Filters'}
                    </button>
                </div>
            )}
        </div>
      </div>
    </>
  );
}