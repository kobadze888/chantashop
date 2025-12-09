// src/components/catalog/CatalogClient.tsx

'use client';

import { useState, useEffect, Suspense, useMemo, useTransition, useRef } from 'react'; 
import { SlidersHorizontal, X, ChevronDown, ShoppingBag, RefreshCcw } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import type { Product, Category, FilterTerm } from '@/types';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCartStore } from '@/store/cartStore'; 
import Image from 'next/image';
import { Link } from '@/navigation';

interface CatalogClientProps {
  initialProducts: Product[];
  categories: Category[];
  colors: FilterTerm[];
  sizes: FilterTerm[];
  locale: string;
}

const colorMap: Record<string, string> = {
  'shavi': '#000000', 'tetri': '#FFFFFF', 'lurji': '#2563EB', 'muqi_lurji': '#1E3A8A',
  'cisferi': '#60A5FA', 'beji': '#F5F5DC', 'yavisferi': '#8B4513', 'vardisferi': '#DB2777',
  'witeli': '#DC2626', 'mwvane': '#16A34A', 'stafilosferi': '#F97316', 'nacrisferi': '#9CA3AF',
  'vercxlisferi': '#C0C0C0', 'oqrosferi': '#FFD700', 'iasamnisferi': '#A855F7', 'kanisferi': '#FFE4C4'
};

const parsePrice = (priceString: string | undefined | null): number => {
  if (!priceString) return 0;
  const matches = priceString.match(/(\d+\.?\d*)/g);
  if (!matches || matches.length === 0) return 0;
  const prices = matches.map(p => parseFloat(p));
  return Math.min(...prices);
};

// Wrapper for Suspense 
export default function CatalogClient(props: CatalogClientProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CatalogContent {...props} />
    </Suspense>
  );
}

function CatalogContent({ initialProducts, categories, colors, sizes, locale }: CatalogClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const sortDropdownRef = useRef<HTMLDivElement>(null); 

  // 1. URL-თან სინქრონიზებული მდგომარეობა
  const [maxPrice, setMaxPrice] = useState(Number(searchParams.get('maxPrice')) || 5000);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isPending, startTransition] = useTransition(); 

  const activeSort = searchParams.get('sort') || 'DATE_DESC'; 
  
  const activeCategory = searchParams.get('category') || 'all';
  const activeColor = searchParams.get('color') || 'all';
  const activeSize = searchParams.get('material') || 'all';
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  
  // კატეგორიები გაშლილია (true), დანარჩენი ჩაკეცილია (false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true); 
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [isColorsOpen, setIsColorsOpen] = useState(false); 
  const [isMaterialsOpen, setIsMaterialsOpen] = useState(false);

  // Custom Sort Dropdown
  const [isSortOpen, setIsSortOpen] = useState(false);


  // Scroll Lock
  useEffect(() => {
    if (modalVisible || mobileFiltersOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [modalVisible, mobileFiltersOpen]);
  
  // Close Sort Dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    if (isSortOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSortOpen]); 


  // URL განახლების ფუნქცია 
  const updateFilter = (key: string, value: string | number) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Default sort-ის URL-დან წაშლა
    if (value === 'all' || value === 0 || (key === 'sort' && value === 'DATE_DESC')) { 
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
    
    // კატეგორიის შეცვლისას ვასუფთავებთ ფერისა და მასალის ფილტრებს URL-ში
    if (key === 'category') {
        params.delete('color');
        params.delete('material');
    }

    startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };
  
  // ფილტრების გასუფთავება
  const handleClearFilters = () => {
    const params = new URLSearchParams();
    // ვინარჩუნებთ მხოლოდ სორტირებას (თუ არ არის default)
    if (activeSort !== 'DATE_DESC') {
        params.set('sort', activeSort);
    }
    startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
        setMobileFiltersOpen(false); 
        setMaxPrice(5000); 
    });
  };


  // Handlers
  const handleCategoryChange = (slug: string) => updateFilter('category', activeCategory === slug ? 'all' : slug);
  const handleColorChange = (slug: string) => updateFilter('color', activeColor === slug ? 'all' : slug);
  const handleSizeChange = (slug: string) => updateFilter('material', activeSize === slug ? 'all' : slug);
  const handlePriceChangeFinal = (value: number) => updateFilter('maxPrice', value);
  const handleSortChange = (sortValue: string) => updateFilter('sort', sortValue); 

  // Modal Functions
  const openQuickView = (product: Product) => { setSelectedProduct(product); setTimeout(() => setModalVisible(true), 10); };
  const closeQuickView = () => { setModalVisible(false); setTimeout(() => { setSelectedProduct(null); }, 200); };
  
  const handleAddToCartFromModal = () => { 
      if (selectedProduct) { 
          addItem({ 
              id: selectedProduct.databaseId, 
              name: selectedProduct.name, 
              price: selectedProduct.salePrice || selectedProduct.price, 
              image: selectedProduct.image?.sourceUrl || '/placeholder.jpg', 
              slug: selectedProduct.slug 
          }); 
          closeQuickView(); 
      } 
  };
  
  // შემოწმება, არის თუ არა ფილტრები აქტიური
  const filtersActive = activeCategory !== 'all' || activeColor !== 'all' || activeSize !== 'all' || maxPrice < 5000;


  // --- დინამიური ატრიბუტების ლოგიკა (UI-ის რაოდენობებისათვის) --- 
  const getAttrCounts = (products: Product[], attrName: 'pa_color' | 'pa_masala' | 'category') => {
    const counts: Record<string, number> = {};
    products.forEach(p => {
        let terms: { slug: string }[] = [];
        if (attrName === 'category') terms = p.productCategories?.nodes || [];
        else {
            const attr = p.attributes?.nodes.find(a => a.name === attrName);
            terms = attr?.options?.map(opt => ({ slug: opt.toLowerCase().trim() })) || [];
        }
        terms.forEach(term => {
            const slug = term.slug;
            counts[slug] = (counts[slug] || 0) + 1;
        });
    });
    return counts;
  };

  // კატეგორიები
  const productsForCategories = useMemo(() => {
    const priceMax = Number(searchParams.get('maxPrice')) || 5000;
    return initialProducts.filter(p => parsePrice(p.price) <= priceMax);
  }, [initialProducts, searchParams]);

  const categoryCounts = useMemo(() => getAttrCounts(productsForCategories, 'category' as 'pa_color'), [productsForCategories]);
  
  const availableCategories = useMemo(() => {
    return categories
      .map(c => ({ 
          ...c, 
          count: categoryCounts[c.slug.toLowerCase()] || c.count || 0 
      }))
      .filter(c => c.count > 0 || c.slug === activeCategory);
  }, [categories, categoryCounts, activeCategory]);


  // ატრიბუტები (ფერები/მასალები)
  const productsForAttrs = useMemo(() => {
    const priceMax = Number(searchParams.get('maxPrice')) || 5000;
    
    return initialProducts.filter(p => {
        const priceMatch = parsePrice(p.price) <= priceMax;
        const categoryMatch = activeCategory === 'all' || p.productCategories?.nodes.some(c => c.slug === activeCategory);
        return priceMatch && categoryMatch;
    });
  }, [initialProducts, activeCategory, searchParams]);

  // ფერები
  const colorCounts = useMemo(() => getAttrCounts(productsForAttrs, 'pa_color'), [productsForAttrs]);
  const availableColors = useMemo(() => {
    return colors
      .map(c => ({ ...c, count: colorCounts[c.slug.toLowerCase()] || 0 }))
      .filter(c => c.count > 0 || c.slug === activeColor);
  }, [colors, colorCounts, activeColor]);

  // მასალები
  const sizeCounts = useMemo(() => getAttrCounts(productsForAttrs, 'pa_masala'), [productsForAttrs]);
  const availableSizes = useMemo(() => {
    return sizes
      .map(s => ({ ...s, count: sizeCounts[s.slug.toLowerCase()] || 0 }))
      .filter(s => s.count > 0 || s.slug === activeSize);
  }, [sizes, sizeCounts, activeSize]);
  
  
  // სორტირების ოფციები 
  const sortOptions = [
    { value: 'DATE_DESC', label: locale === 'ka' ? 'ახალი დამატებული' : 'Newest' },
    { value: 'POPULARITY_DESC', label: locale === 'ka' ? 'პოპულარობით' : 'Popularity' },
    { value: 'PRICE_ASC', label: locale === 'ka' ? 'ფასი: ზრდადობით' : 'Price: Low to High' },
    { value: 'PRICE_DESC', label: locale === 'ka' ? 'ფასი: კლებადობით' : 'Price: High to Low' },
  ];


  return (
    <>
      {/* QUICK VIEW MODAL (ლოგიკა უცვლელია) */}
      {selectedProduct && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${modalVisible ? 'visible' : 'invisible'}`}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={closeQuickView}></div>
            <div className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[600px] transition-all duration-300 ${modalVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <button onClick={closeQuickView} className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-brand-light transition shadow-sm"><X className="w-6 h-6 h-dark" /></button>
                <div className="w-full md:w-1/2 bg-gray-50 relative min-h-[300px]">
                    <Image src={selectedProduct.image?.sourceUrl || '/placeholder.jpg'} alt={selectedProduct.name} fill className="object-cover"/>
                </div>
                <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">
                    <div className="mb-auto">
                        <span className="text-xs font-bold text-brand-DEFAULT uppercase tracking-wider mb-2 block">{selectedProduct.productCategories?.nodes[0]?.name || 'Collection'}</span>
                        <h2 className="text-3xl font-black text-brand-dark mb-2 leading-tight">{selectedProduct.name}</h2>
                        <p className="text-2xl font-black text-brand-dark mb-4">{selectedProduct.salePrice || selectedProduct.price}</p>
                        <div className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-4" dangerouslySetInnerHTML={{ __html: selectedProduct.shortDescription || selectedProduct.description || 'აღწერა არ არის.' }} />
                        <div className="mb-6">
                            <span className="text-xs font-bold text-brand-dark uppercase mb-2 block">ფერი</span>
                            <div className="flex gap-3">
                                {selectedProduct.attributes?.nodes.find(a => a.name === 'pa_color')?.options?.map((opt, i) => (
                                    <div key={i} className="w-8 h-8 rounded-full border border-gray-200" style={{ backgroundColor: colorMap[opt.toLowerCase()] || '#eee' }} title={opt} />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-gray-100 mt-6">
                        <button onClick={handleAddToCartFromModal} className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold hover:bg-brand-DEFAULT transition active:scale-95 shadow-lg flex items-center justify-center gap-2"><ShoppingBag className="w-5 h-5" /> კალათაში დამატება</button>
                        <Link href={`/product/${selectedProduct.slug}`} className="w-full block text-center text-xs font-bold text-brand-dark mt-4 hover:underline uppercase tracking-wide">სრული გვერდის ნახვა</Link>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* MOBILE FILTERS: Backdrop Close დამატებულია */}
      <div 
        id="filter-overlay" 
        className={`fixed inset-0 bg-black/60 z-[80] transition-opacity duration-300 md:hidden ${mobileFiltersOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setMobileFiltersOpen(false)} 
      >
        <div 
          className={`absolute right-0 top-0 bottom-0 w-[80%] bg-white p-6 overflow-y-auto transform transition-transform duration-300 ${mobileFiltersOpen ? 'translate-x-0' : 'translate-x-full'}`} 
          id="filter-content"
          onClick={(e) => e.stopPropagation()} 
        >
            <div className="flex justify-between items-center mb-8">
                <h3 className="font-serif font-bold text-2xl">{locale === 'ka' ? 'ფილტრაცია' : 'Filters'}</h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="space-y-8">
                <div>
                    <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-brand-dark">{locale === 'ka' ? 'კატეგორიები' : 'Categories'}</h4>
                    <div className="space-y-3"> 
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" checked={activeCategory === 'all'} onChange={() => handleCategoryChange('all')} className="w-5 h-5 rounded border-gray-300 text-brand-DEFAULT focus:ring-brand-DEFAULT" />
                            <span className="text-gray-600 group-hover:text-brand-dark transition">{locale === 'ka' ? 'ყველა' : 'All'}</span>
                        </label>
                        {availableCategories.map((cat) => (
                            <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" checked={activeCategory === cat.slug} onChange={() => handleCategoryChange(cat.slug)} className="w-5 h-5 rounded border-gray-300 text-brand-DEFAULT focus:ring-brand-DEFAULT" />
                                <div className="flex items-center justify-between w-full overflow-hidden">
                                    <span className="text-gray-600 group-hover:text-brand-dark transition font-medium text-sm truncate mr-1" title={cat.name}>{cat.name}</span>
                                    <span className="ml-auto text-xs text-gray-400 font-bold">{cat.count}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Mobile Price */}
                <div>
                  <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-brand-dark">{locale === 'ka' ? 'ფასი' : 'Price'}</h4>
                  <div className="px-2">
                      <input type="range" className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-DEFAULT" min="0" max="5000" step="50" value={maxPrice} onMouseUp={(e) => handlePriceChangeFinal(Number((e.target as HTMLInputElement).value))} onChange={(e) => setMaxPrice(Number(e.target.value))} />
                      <div className="flex justify-between mt-3 text-sm font-bold text-gray-500">
                          <span>0 ₾</span>
                          <span>{maxPrice} ₾</span>
                      </div>
                  </div>
                </div>

                {/* Mobile Colors */}
                {availableColors.length > 0 && (
                    <div>
                        <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-brand-dark">{locale === 'ka' ? 'ფერი' : 'Color'}</h4>
                        <div className="flex flex-wrap gap-4">
                            <button onClick={() => handleColorChange('all')} className={`px-3 py-1 text-xs border rounded-full transition cursor-pointer ${activeColor === 'all' ? 'bg-brand-dark text-white' : 'bg-white hover:border-brand-dark'}`}>{locale === 'ka' ? 'ყველა' : 'All'}</button>
                            {availableColors.map((color) => (
                                <button key={color.id} onClick={() => handleColorChange(color.slug)} className={`w-8 h-8 rounded-full border-2 border-gray-200 transition duration-150 transform hover:scale-110 cursor-pointer ${activeColor === color.slug ? 'color-swatch-selected' : ''}`} style={{ backgroundColor: colorMap[color.slug] || '#e5e7eb' }} title={color.name} />
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Mobile Materials */}
                {availableSizes.length > 0 && (
                  <div>
                      <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-brand-dark">{locale === 'ka' ? 'მასალა' : 'Material'}</h4>
                      <div className="space-y-3">
                          {availableSizes.map((size) => (
                              <label key={size.id} className="flex items-center gap-3 cursor-pointer group">
                                  <input type="checkbox" checked={activeSize === size.slug} onChange={() => handleSizeChange(size.slug)} className="w-5 h-5 rounded border-gray-300 text-brand-DEFAULT focus:ring-brand-DEFAULT shadow-sm flex-shrink-0" />
                                  <div className="flex items-center justify-between w-full overflow-hidden">
                                      <span className="text-gray-600 group-hover:text-brand-dark transition font-medium text-sm truncate mr-1" title={size.name}>{size.name}</span>
                                      <span className="ml-auto text-xs text-gray-400 font-bold">{size.count}</span>
                                  </div>
                              </label>
                          ))}
                      </div>
                  </div>
                )}
                
                {/* Mobile Filter Clear Button */}
                <button onClick={handleClearFilters} disabled={!filtersActive} className={`w-full py-3 rounded-xl font-bold mt-8 transition flex items-center justify-center gap-2 ${filtersActive ? 'bg-brand-DEFAULT text-white hover:bg-brand-dark' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>
                    <RefreshCcw className="w-4 h-4" /> {locale === 'ka' ? 'ფილტრების გასუფთავება' : 'Clear Filters'}
                </button>
                
                <button onClick={() => setMobileFiltersOpen(false)} className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold mt-4">{locale === 'ka' ? 'შედეგების ჩვენება' : 'Show Results'}</button>
            </div>
        </div>
      </div>

      {/* 2. MAIN DESKTOP LAYOUT */}
      <div className="container mx-auto px-4 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-100 pb-8">
              <div>
                  <span className="text-brand-DEFAULT text-xs font-bold tracking-widest uppercase mb-2 block">2025 წლის კოლექცია</span>
                  <h1 className="text-4xl md:text-6xl font-serif font-black text-brand-dark">{locale === 'ka' ? 'სრული კატალოგი' : 'Catalog'}</h1>
                  <p className="text-gray-400 mt-2 text-sm">
                    {initialProducts.length} {locale === 'ka' ? 'პროდუქტი' : 'products'}
                    {isPending && <span className="text-brand-DEFAULT ml-2 animate-pulse">იტვირთება...</span>}
                  </p>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                  <button onClick={() => setMobileFiltersOpen(true)} className="md:hidden flex-1 bg-gray-100 text-brand-dark py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition"><SlidersHorizontal className="w-5 h-5" /> {locale === 'ka' ? 'ფილტრაცია' : 'Filter'}</button>
                  
                  {/* Custom Sort Dropdown */}
                  <div className="relative flex-1 md:flex-none" ref={sortDropdownRef}> 
                      <button
                          onClick={() => setIsSortOpen(prev => !prev)}
                          className="w-full md:w-auto appearance-none bg-white border border-gray-200 text-brand-dark py-3 px-6 pr-10 rounded-xl font-bold outline-none focus:border-brand-DEFAULT cursor-pointer shadow-sm flex items-center justify-between"
                      >
                          {sortOptions.find(o => o.value === activeSort)?.label || sortOptions[0].label}
                          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''} ml-2`} />
                      </button>

                      {isSortOpen && (
                          <div className="absolute right-0 mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-30 animate-fade-in"> 
                              {sortOptions.map(option => (
                                  <button
                                      key={option.value}
                                      onClick={() => {
                                          handleSortChange(option.value);
                                          setIsSortOpen(false);
                                      }}
                                      className={`w-full px-5 py-3 text-sm text-left transition text-brand-dark cursor-pointer ${option.value === activeSort ? 'bg-brand-light font-bold text-brand-DEFAULT' : 'hover:bg-gray-50'}`}
                                  >
                                      {option.label}
                                  </button>
                              ))}
                          </div>
                      )}
                  </div>
              </div>
          </div>
      </div>

      <div className="container mx-auto px-4 flex gap-12 relative">
        {/* ✅ Desktop Sidebar (ახალი სტრუქტურა Sticky ღილაკისთვის) */}
        <div className="hidden md:block w-1/4 sticky top-28 h-[calc(100vh-8rem)] relative"> {/* Sticky container for the entire sidebar block */}
            
             {/* ✅ 1. Sticky Clear Filters Button at the Top */}
            <div className="sticky top-0 z-10 bg-white pt-4 pb-4 border-b border-gray-100 -mx-4 px-4">
                <button onClick={handleClearFilters} disabled={!filtersActive} className={`w-full py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${filtersActive ? 'bg-brand-DEFAULT text-white hover:bg-brand-dark' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>
                    <RefreshCcw className="w-4 h-4" /> {locale === 'ka' ? 'ფილტრების გასუფთავება' : 'Clear Filters'}
                </button>
            </div>

            {/* 2. Filters List (Scrollable Below the Sticky Button) */}
            <aside className="space-y-10 overflow-y-auto pr-4 pt-6 pb-24 h-full"> {/* h-full უზრუნველყოფს სქროლვას */}
                
                {/* 1. Categories Filter (Collapsible) - გაშლილია */}
                <div>
                    <button 
                      className="flex justify-between items-center w-full font-bold uppercase text-xs tracking-widest text-brand-dark border-b border-gray-100 pb-2 mb-6 cursor-pointer"
                      onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                    >
                        {locale === 'ka' ? 'კატეგორიები' : 'Categories'}
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isCategoriesOpen && (
                        <div className="grid grid-cols-2 gap-x-6 gap-y-3 animate-fade-in">
                            <label className="flex items-center gap-3 cursor-pointer group col-span-2">
                                <input type="checkbox" checked={activeCategory === 'all'} onChange={() => handleCategoryChange('all')} className="w-5 h-5 rounded border-gray-300 text-brand-DEFAULT focus:ring-brand-DEFAULT shadow-sm flex-shrink-0" />
                                <span className="text-gray-600 group-hover:text-brand-dark transition font-medium">{locale === 'ka' ? 'ყველა' : 'All'}</span>
                            </label>
                            {availableCategories.map((cat) => (
                                <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" checked={activeCategory === cat.slug} onChange={() => handleCategoryChange(cat.slug)} className="w-5 h-5 rounded border-gray-300 text-brand-DEFAULT focus:ring-brand-DEFAULT shadow-sm flex-shrink-0" />
                                    <div className="flex items-center justify-between w-full overflow-hidden">
                                        <span className="text-gray-600 group-hover:text-brand-dark transition font-medium text-sm truncate mr-1" title={cat.name}>{cat.name}</span>
                                        <span className="text-[10px] text-gray-400 font-bold bg-gray-50 px-1.5 py-0.5 rounded flex-shrink-0">{cat.count}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* 2. Price Filter (Collapsible) - ჩაკეცილია */}
                <div>
                    <button 
                      className="flex justify-between items-center w-full font-bold uppercase text-xs tracking-widest text-brand-dark border-b border-gray-100 pb-2 mb-6 cursor-pointer"
                      onClick={() => setIsPriceOpen(!isPriceOpen)}
                    >
                        {locale === 'ka' ? 'ფასი' : 'Price'}
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isPriceOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isPriceOpen && (
                        <div className="px-2 animate-fade-in">
                            <input type="range" className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-DEFAULT" min="0" max="5000" step="50" value={maxPrice} onMouseUp={(e) => handlePriceChangeFinal(Number((e.target as HTMLInputElement).value))} onChange={(e) => setMaxPrice(Number(e.target.value))} />
                            <div className="flex justify-between mt-3 text-sm font-bold text-gray-500"><span>0 ₾</span><span>{maxPrice} ₾</span></div>
                        </div>
                    )}
                </div>

                {/* 3. Colors Filter (Collapsible) - ჩაკეცილია */}
                {availableColors.length > 0 && (
                    <div>
                        <button 
                            className="flex justify-between items-center w-full font-bold uppercase text-xs tracking-widest text-brand-dark border-b border-gray-100 pb-2 mb-6 cursor-pointer"
                            onClick={() => setIsColorsOpen(!isColorsOpen)}
                        >
                            {locale === 'ka' ? 'ფერი' : 'Color'}
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isColorsOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isColorsOpen && (
                            <div className="flex flex-wrap gap-4 animate-fade-in">
                                <button onClick={() => handleColorChange('all')} className={`px-3 py-1 text-xs border rounded-full transition cursor-pointer ${activeColor === 'all' ? 'bg-brand-dark text-white' : 'bg-white hover:border-brand-dark'}`}>All</button>
                                {availableColors.map((color) => (
                                    <button key={color.id} onClick={() => handleColorChange(color.slug)} className={`w-8 h-8 rounded-full border-2 border-gray-200 transition duration-150 transform hover:scale-110 cursor-pointer ${activeColor === color.slug ? 'color-swatch-selected' : ''}`} style={{ backgroundColor: colorMap[color.slug] || '#e5e7eb' }} title={color.name} />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* 4. Materials Filter (Collapsible) - ჩაკეცილია */}
                {availableSizes.length > 0 && (
                    <div className="pb-4"> 
                        <button 
                            className="flex justify-between items-center w-full font-bold uppercase text-xs tracking-widest text-brand-dark border-b border-gray-100 pb-2 mb-6 cursor-pointer"
                            onClick={() => setIsMaterialsOpen(!isMaterialsOpen)}
                        >
                            {locale === 'ka' ? 'მასალა' : 'Material'}
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMaterialsOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isMaterialsOpen && (
                            <div className="grid grid-cols-2 gap-3 animate-fade-in">
                                {availableSizes.map((size) => (
                                    <label key={size.id} className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" checked={activeSize === size.slug} onChange={() => handleSizeChange(size.slug)} className="w-5 h-5 rounded border-gray-300 text-brand-DEFAULT focus:ring-brand-DEFAULT shadow-sm flex-shrink-0" />
                                        <div className="flex items-center justify-between w-full overflow-hidden">
                                            <span className="text-gray-600 group-hover:text-brand-dark transition font-medium text-sm truncate mr-1" title={size.name}>{size.name}</span>
                                            <span className="text-[10px] text-gray-400 font-bold bg-gray-50 px-1.5 py-0.5 rounded flex-shrink-0">{size.count}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                
            </aside>
            
        </div>

        <div className="flex-1">
            <div className={`grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 md:gap-8 transition-opacity duration-300 ${isPending ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                {initialProducts.map((product) => (
                    <ProductCard 
                        key={product.databaseId || product.id}
                        id={product.databaseId}
                        name={product.name}
                        price={product.price ? `${parsePrice(product.price)} ₾` : ''}
                        salePrice={product.salePrice}
                        regularPrice={product.regularPrice}
                        image={product.image?.sourceUrl}
                        secondImage={product.galleryImages?.nodes[0]?.sourceUrl}
                        slug={product.slug}
                        attributes={product.attributes}
                        locale={locale}
                        onQuickView={() => openQuickView(product)}
                    />
                ))}
            </div>
            {initialProducts.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                    <p>{locale === 'ka' ? 'პროდუქტები არ მოიძებნა.' : 'No products found.'}</p>
                    <button onClick={() => updateFilter('category', 'all')} className="mt-4 text-brand-DEFAULT underline text-sm">ფილტრის გასუფთავება</button>
                </div>
            )}
        </div>
      </div>
    </>
  );
}