'use client';

import { useState } from 'react';
import { SlidersHorizontal, Check, X, ChevronDown } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import type { Product, Category } from '@/types';

interface CatalogClientProps {
  initialProducts: Product[];
  categories: Category[];
  locale: string;
}

export default function CatalogClient({ initialProducts, categories, locale }: CatalogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredProducts = selectedCategory === 'all' 
    ? initialProducts 
    : initialProducts.filter(p => p.productCategories?.nodes.some(c => c.slug === selectedCategory));

  return (
    <>
      {/* CATALOG HEADER (Matches catalog_page.html structure exactly) */}
      <div className="container mx-auto px-4 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-100 pb-8">
              <div>
                  <span className="text-brand-DEFAULT text-xs font-bold tracking-widest uppercase mb-2 block">2025</span>
                  <h1 className="text-4xl md:text-6xl font-serif font-black text-brand-dark">
                    {locale === 'ka' ? 'სრული კატალოგი' : 'Catalog'}
                  </h1>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                  {/* Mobile Filter Button */}
                  <button 
                    onClick={() => setMobileFiltersOpen(true)}
                    className="md:hidden flex-1 bg-gray-100 text-brand-dark py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition"
                  >
                      <SlidersHorizontal className="w-5 h-5" /> ფილტრაცია
                  </button>
                  {/* Sort Dropdown */}
                  <div className="relative flex-1 md:flex-none">
                      <select className="w-full md:w-auto appearance-none bg-white border border-gray-200 text-brand-dark py-3 px-6 pr-10 rounded-xl font-bold outline-none focus:border-brand-DEFAULT cursor-pointer shadow-sm">
                          <option>პოპულარობით</option>
                          <option>ფასი: ზრდადობით</option>
                          <option>ფასი: კლებადობით</option>
                          <option>ახალი დამატებული</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
              </div>
          </div>
      </div>

      <div className="container mx-auto px-4 flex gap-12 relative">
        
        {/* MOBILE FILTER OVERLAY (Matches catalog_page.html ID="filter-overlay") */}
        <div 
            className={`fixed inset-0 bg-black/60 z-[80] md:hidden transition-opacity duration-300 ${mobileFiltersOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} 
            onClick={() => setMobileFiltersOpen(false)}
        >
            <div 
                className={`absolute right-0 top-0 bottom-0 w-[80%] bg-white p-6 overflow-y-auto transition-transform duration-300 ${mobileFiltersOpen ? 'translate-x-0' : 'translate-x-full'}`} 
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-8">
                    <h3 className="font-serif font-bold text-2xl">ფილტრაცია</h3>
                    <button onClick={() => setMobileFiltersOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                {/* Mobile Filters Content */}
                <div className="space-y-8">
                    <div>
                        <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-brand-dark">კატეგორიები</h4>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input 
                                    type="radio" 
                                    checked={selectedCategory === 'all'} 
                                    onChange={() => setSelectedCategory('all')} 
                                    className="accent-brand-DEFAULT w-5 h-5" 
                                />
                                <span>ყველა</span>
                            </label>
                            {categories.map((cat) => (
                                <label key={cat.id} className="flex items-center gap-3 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        checked={selectedCategory === cat.slug} 
                                        onChange={() => setSelectedCategory(cat.slug)} 
                                        className="accent-brand-DEFAULT w-5 h-5" 
                                    />
                                    <span>{cat.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <button 
                        onClick={() => setMobileFiltersOpen(false)} 
                        className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold mt-8"
                    >
                        შედეგების ჩვენება
                    </button>
                </div>
            </div>
        </div>

        {/* SIDEBAR (DESKTOP) */}
        <aside className="hidden md:block w-1/4 space-y-10 sticky top-32 h-fit">
            {/* Categories */}
            <div>
                <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-brand-dark border-b border-gray-100 pb-2">კატეგორიები</h4>
                <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                            type="checkbox" 
                            checked={selectedCategory === 'all'}
                            onChange={() => setSelectedCategory('all')}
                            className="w-5 h-5 rounded border-gray-300 text-brand-DEFAULT focus:ring-brand-DEFAULT shadow-sm cursor-pointer"
                        />
                        <span className="text-gray-600 group-hover:text-brand-dark transition font-medium">ყველა ჩანთა</span>
                    </label>

                    {categories.map((cat) => (
                        <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                            <input 
                                type="checkbox"
                                checked={selectedCategory === cat.slug}
                                onChange={() => setSelectedCategory(cat.slug)}
                                className="w-5 h-5 rounded border-gray-300 text-brand-DEFAULT focus:ring-brand-DEFAULT shadow-sm cursor-pointer"
                            />
                            <span className="text-gray-600 group-hover:text-brand-dark transition font-medium">{cat.name}</span>
                            {cat.count && <span className="ml-auto text-xs text-gray-400 font-bold bg-gray-50 px-2 py-1 rounded">{cat.count}</span>}
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-brand-dark border-b border-gray-100 pb-2">ფასი</h4>
                <div className="px-2">
                    <input type="range" className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-DEFAULT" min="0" max="5000" />
                    <div className="flex justify-between mt-3 text-sm font-bold text-gray-500">
                        <span>0 ₾</span>
                        <span>5000+ ₾</span>
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
                        price={product.price}
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
                <div className="text-center py-20 text-gray-400">პროდუქტები არ მოიძებნა.</div>
            )}
        </div>
      </div>
    </>
  );
}