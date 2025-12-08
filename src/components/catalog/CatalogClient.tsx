// src/components/catalog/CatalogClient.tsx

'use client';

import { useState, useMemo } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import type { Product, Category, FilterTerm } from '@/types';

interface CatalogClientProps {
  initialProducts: Product[];
  categories: Category[];
  colors: FilterTerm[];
  sizes: FilterTerm[]; // რეალურად მასალები (pa_masala)
  locale: string;
}

// ✅ ფასის გასუფთავება (მუშაობს "20.00, 20.00"-ზეც)
const parsePrice = (priceString: string | undefined | null): number => {
  if (!priceString) return 0;
  // ამოვიღოთ ყველა რიცხვი
  const matches = priceString.match(/(\d+\.?\d*)/g);
  if (!matches || matches.length === 0) return 0;
  // დავაბრუნოთ მინიმალური ფასი
  const prices = matches.map(p => parseFloat(p));
  return Math.min(...prices);
};

// ფერების ვიზუალიზაცია
const colorMap: Record<string, string> = {
  'shavi': '#000000',
  'tetri': '#FFFFFF',
  'lurji': '#2563EB',
  'muqi_lurji': '#1E3A8A',
  'cisferi': '#60A5FA',
  'beji': '#F5F5DC',
  'yavisferi': '#8B4513',
  'vardisferi': '#DB2777',
  'witeli': '#DC2626',
  'mwvane': '#16A34A',
  'stafilosferi': '#F97316',
  'nacrisferi': '#9CA3AF',
  'vercxlisferi': '#C0C0C0',
  'oqrosferi': '#FFD700',
  'iasamnisferi': '#A855F7',
  'kanisferi': '#FFE4C4'
};

export default function CatalogClient({ initialProducts, categories, colors, sizes, locale }: CatalogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all'); // pa_masala
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      
      // 1. 📂 კატეგორიის ფილტრი
      const categoryMatch = selectedCategory === 'all' 
        ? true 
        : product.productCategories?.nodes.some(c => c.slug === selectedCategory);

      // 2. 🎨 ფერის ფილტრი (pa_color)
      const colorMatch = selectedColor === 'all'
        ? true
        : product.attributes?.nodes.some(attr => {
            // ვამოწმებთ არის თუ არა ეს ატრიბუტი ფერი
            if (attr.name !== 'pa_color') return false;
            
            // ვამოწმებთ, შეიცავს თუ არა options არჩეულ სლაგს (მაგ: "shavi")
            // თქვენს JSON-ში options მოდის როგორც ["shavi"], ["lurji"]
            return attr.options?.some(opt => opt.toLowerCase() === selectedColor.toLowerCase());
          });

      // 3. 🧵 მასალის ფილტრი (pa_masala - კოდში sizes)
      const sizeMatch = selectedSize === 'all'
        ? true
        : product.attributes?.nodes.some(attr => {
            if (attr.name !== 'pa_masala') return false;
            
            // JSON-ში მასალაც სლაგად მოდის (მაგ: "eko_tyavi")
            return attr.options?.some(opt => opt.toLowerCase() === selectedSize.toLowerCase());
          });

      // 4. 💰 ფასის ფილტრი
      const productPrice = parsePrice(product.price);
      // თუ ფასი 0-ია (ვერ ამოიკითხა), მაინც ვაჩვენოთ, ან შეგვიძლია დავმალოთ (productPrice > 0 && ...)
      const priceMatch = productPrice <= maxPrice;

      return categoryMatch && colorMatch && sizeMatch && priceMatch;
    });
  }, [initialProducts, selectedCategory, selectedColor, selectedSize, maxPrice]);

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
                    {filteredProducts.length} {locale === 'ka' ? 'პროდუქტი' : 'products'}
                  </p>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                  <button 
                    onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                    className="md:hidden flex-1 bg-gray-100 text-brand-dark py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition"
                  >
                      <SlidersHorizontal className="w-5 h-5" /> {locale === 'ka' ? 'ფილტრაცია' : 'Filter'}
                  </button>
              </div>
          </div>
      </div>

      <div className="container mx-auto px-4 flex gap-12 relative">
        
        {/* SIDEBAR (DESKTOP) & MOBILE OVERLAY logic here... keeping structure simple */}
        <aside className={`${mobileFiltersOpen ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden'} md:block md:w-1/4 md:static md:p-0 space-y-10 md:sticky md:top-32 md:h-fit`}>
            
            {mobileFiltersOpen && (
                <div className="flex justify-between items-center mb-6 md:hidden">
                    <h3 className="font-bold text-xl">ფილტრაცია</h3>
                    <button onClick={() => setMobileFiltersOpen(false)} className="p-2 bg-gray-100 rounded-full">✕</button>
                </div>
            )}

            {/* Categories */}
            <div>
                <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-brand-dark border-b border-gray-100 pb-2">
                    {locale === 'ka' ? 'კატეგორიები' : 'Categories'}
                </h4>
                <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                            type="radio" 
                            name="cat_filter"
                            checked={selectedCategory === 'all'}
                            onChange={() => setSelectedCategory('all')}
                            className="accent-brand-DEFAULT w-5 h-5"
                        />
                        <span>{locale === 'ka' ? 'ყველა' : 'All'}</span>
                    </label>
                    {categories.map((cat) => (
                        <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                            <input 
                                type="radio"
                                name="cat_filter"
                                checked={selectedCategory === cat.slug}
                                onChange={() => setSelectedCategory(cat.slug)}
                                className="accent-brand-DEFAULT w-5 h-5"
                            />
                            <span>{cat.name}</span>
                            <span className="ml-auto text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">{cat.count || 0}</span>
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
                             className={`px-3 py-1 text-xs border rounded-full transition ${selectedColor === 'all' ? 'bg-brand-dark text-white' : 'bg-white hover:border-brand-dark'}`}
                        >All</button>
                        {colors.map((color) => (
                            <button
                                key={color.id}
                                onClick={() => setSelectedColor(color.slug)}
                                className={`w-8 h-8 rounded-full shadow-sm transition-transform hover:scale-110 border ${
                                    selectedColor === color.slug 
                                        ? 'ring-2 ring-brand-DEFAULT ring-offset-2 border-transparent scale-110' 
                                        : 'border-gray-200'
                                }`}
                                style={{ backgroundColor: colorMap[color.slug] || '#e5e7eb' }}
                                title={color.name}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Materials (Mapped to Sizes prop) */}
            {sizes.length > 0 && (
                <div>
                    <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-brand-dark border-b border-gray-100 pb-2">
                        {locale === 'ka' ? 'მასალა' : 'Material'}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        <button
                             onClick={() => setSelectedSize('all')}
                             className={`px-3 py-1 text-xs border rounded-lg ${selectedSize === 'all' ? 'bg-brand-dark text-white' : 'bg-white hover:border-brand-dark'}`}
                        >All</button>
                        {sizes.map((size) => (
                            <button
                                key={size.id}
                                onClick={() => setSelectedSize(size.slug)}
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
                        max="500" 
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
                        key={product.databaseId || product.id} // Fallback ID
                        id={product.databaseId}
                        name={product.name}
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
                        onClick={() => {
                            setSelectedCategory('all');
                            setSelectedColor('all');
                            setSelectedSize('all');
                            setMaxPrice(2000);
                        }}
                        className="mt-4 text-brand-DEFAULT underline text-sm"
                    >
                        {locale === 'ka' ? 'ფილტრის გასუფთავება' : 'Clear filters'}
                    </button>
                </div>
            )}
        </div>
      </div>
    </>
  );
}