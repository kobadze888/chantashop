'use client';

import { useState, useEffect, Suspense, useTransition, useRef } from 'react'; 
import { SlidersHorizontal, X, ChevronDown, ShoppingBag, RefreshCcw, Check } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import type { Product, Category, FilterTerm } from '@/types';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import QuickView from '@/components/products/QuickView'; 

interface AttributeGroup {
  taxonomyName: string;
  label: string;
  terms: FilterTerm[];
}

interface CatalogClientProps {
  initialProducts: Product[];
  categories: Category[];
  attributes: AttributeGroup[]; 
  maxPriceLimit?: number; 
  locale: string;
}

const PriceFilter = ({ 
    minPrice, maxPrice, setMinPrice, setMaxPrice, applyFilter, maxLimit 
}: { 
    minPrice: number, maxPrice: number, setMinPrice: (v: number) => void, setMaxPrice: (v: number) => void, applyFilter: () => void, maxLimit: number 
}) => {
    // Helper to handle input changes smoothly
    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val === '') {
            setMinPrice(0);
        } else {
            const num = parseInt(val, 10);
            if (!isNaN(num)) setMinPrice(num);
        }
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val === '') {
            setMaxPrice(maxLimit);
        } else {
            const num = parseInt(val, 10);
            if (!isNaN(num)) setMaxPrice(num);
        }
    };

    return (
        <div className="px-1 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₾</span>
                    <input 
                      type="number" 
                      // ✅ Fix: text-base prevents zoom on mobile, value binding improved
                      value={minPrice === 0 ? '' : minPrice} 
                      onChange={handleMinChange}
                      onFocus={(e) => e.target.select()} // Auto-select on focus for easy typing
                      className="w-full border border-gray-200 bg-gray-50 rounded-lg pl-6 pr-2 py-2 text-base md:text-sm font-bold text-brand-dark focus:border-brand-DEFAULT focus:ring-1 focus:ring-brand-DEFAULT outline-none transition cursor-text" 
                      placeholder="0"
                      min="0"
                      inputMode="numeric"
                    />
                </div>
                <span className="text-gray-400 font-bold">-</span>
                <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₾</span>
                    <input 
                      type="number" 
                      value={maxPrice === maxLimit ? '' : maxPrice} 
                      onChange={handleMaxChange}
                      onFocus={(e) => e.target.select()}
                      className="w-full border border-gray-200 bg-gray-50 rounded-lg pl-6 pr-2 py-2 text-base md:text-sm font-bold text-brand-dark focus:border-brand-DEFAULT focus:ring-1 focus:ring-brand-DEFAULT outline-none transition cursor-text" 
                      placeholder={String(maxLimit)}
                      max={maxLimit}
                      inputMode="numeric"
                    />
                </div>
            </div>
            
            <input 
                type="range" 
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-DEFAULT" 
                min="0" 
                max={maxLimit} 
                step="10" 
                value={maxPrice} 
                onChange={(e) => setMaxPrice(Number(e.target.value))} 
            />
            
            <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400 mb-3">
                <span>0 ₾</span>
                <span>{maxLimit} ₾</span>
            </div>

            <button 
                onClick={applyFilter}
                className="w-full bg-brand-dark text-white py-3 rounded-lg text-xs font-bold hover:bg-brand-DEFAULT transition shadow-sm active:scale-95 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wide"
            >
                <Check className="w-3.5 h-3.5" /> ფასით გაფილტვრა
            </button>
        </div>
    );
};

const colorMap: Record<string, string> = {
  'shavi': '#000000', 'black': '#000000',
  'tetri': '#FFFFFF', 'white': '#FFFFFF',
  'lurji': '#2563EB', 'blue': '#2563EB',
  'muqi_lurji': '#1E3A8A', 'dark-blue': '#1E3A8A',
  'cisferi': '#60A5FA', 'light-blue': '#60A5FA', 'sky-blue': '#60A5FA',
  'beji': '#F5F5DC', 'beige': '#F5F5DC',
  'yavisferi': '#8B4513', 'brown': '#8B4513',
  'vardisferi': '#DB2777', 'pink': '#DB2777',
  'witeli': '#DC2626', 'red': '#DC2626',
  'mwvane': '#16A34A', 'green': '#16A34A',
  'stafilosferi': '#F97316', 'orange': '#F97316',
  'nacrisferi': '#9CA3AF', 'grey': '#9CA3AF', 'gray': '#9CA3AF',
  'vercxlisferi': '#C0C0C0', 'silver': '#C0C0C0',
  'oqrosferi': '#FFD700', 'gold': '#FFD700',
  'iasamnisferi': '#A855F7', 'purple': '#A855F7',
  'kanisferi': '#FFE4C4', 'nude': '#FFE4C4'
};

const parsePrice = (priceString: string | undefined | null): number => {
  if (!priceString) return 0;
  const matches = priceString.match(/(\d+\.?\d*)/g);
  if (!matches || matches.length === 0) return 0;
  const prices = matches.map(p => parseFloat(p));
  return Math.min(...prices);
};

export default function CatalogClient(props: CatalogClientProps) {
  return (
    <Suspense fallback={null}>
      <CatalogContent {...props} />
    </Suspense>
  );
}

function CatalogContent({ initialProducts, categories, attributes, maxPriceLimit = 5000, locale }: CatalogClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('Catalog');
  const tCommon = useTranslations('Common');
  
  const sortDropdownRef = useRef<HTMLDivElement>(null); 
  const productsTopRef = useRef<HTMLDivElement>(null);

  const urlMinPrice = Number(searchParams.get('minPrice')) || 0;
  const urlMaxPrice = Number(searchParams.get('maxPrice')) || maxPriceLimit;

  const [tempMinPrice, setTempMinPrice] = useState(urlMinPrice);
  const [tempMaxPrice, setTempMaxPrice] = useState(urlMaxPrice);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isPending, startTransition] = useTransition(); 

  const activeSort = searchParams.get('sort') || 'DATE_DESC'; 
  const activeCategory = searchParams.get('category') || 'all';

  const getActiveAttr = (taxName: string) => searchParams.get(taxName) || 'all';

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true); 
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [isSortOpen, setIsSortOpen] = useState(false);

  useEffect(() => {
    setTempMinPrice(urlMinPrice);
    setTempMaxPrice(urlMaxPrice);
  }, [urlMinPrice, urlMaxPrice]);

  useEffect(() => {
    document.body.style.overflow = (selectedProduct || mobileFiltersOpen) ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [selectedProduct, mobileFiltersOpen]);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    if (isSortOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSortOpen]); 

  useEffect(() => {
      const defaults: Record<string, boolean> = {};
      attributes?.forEach(attr => { defaults[attr.taxonomyName] = true; });
      setOpenSections(defaults);
  }, [attributes]);

  const toggleSection = (taxName: string) => {
      setOpenSections(prev => ({ ...prev, [taxName]: !prev[taxName] }));
  };

  const scrollToProducts = () => {
    if (productsTopRef.current) {
        // Desktop: scroll to products, Mobile: only if not in modal (modal handles itself)
        const offset = 100; // Offset for header
        const elementPosition = productsTopRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
             top: offsetPosition,
             behavior: "smooth"
        });
    }
  };

  const updateFilter = (key: string, value: string | number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all' || value === 0 || (key === 'sort' && value === 'DATE_DESC')) { 
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
    startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
        scrollToProducts();
    });
  };

  const removeFilterBadge = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    if (key === 'minPrice' || key === 'maxPrice') {
        setTempMinPrice(0);
        setTempMaxPrice(maxPriceLimit);
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
      scrollToProducts();
    });
  };

  const applyPriceFilter = () => {
      const params = new URLSearchParams(searchParams.toString());
      let finalMin = tempMinPrice < 0 ? 0 : tempMinPrice;
      let finalMax = tempMaxPrice > maxPriceLimit ? maxPriceLimit : tempMaxPrice;
      if (finalMin > finalMax) {
          finalMin = 0;
          finalMax = maxPriceLimit;
          setTempMinPrice(0);
          setTempMaxPrice(maxPriceLimit);
      }
      if (finalMin > 0) params.set('minPrice', String(finalMin)); else params.delete('minPrice');
      if (finalMax < maxPriceLimit) params.set('maxPrice', String(finalMax)); else params.delete('maxPrice');
      startTransition(() => {
          router.push(`${pathname}?${params.toString()}`, { scroll: false });
          setMobileFiltersOpen(false);
          scrollToProducts();
      });
  };
  
  const handleClearFilters = () => {
    const params = new URLSearchParams();
    if (activeSort !== 'DATE_DESC') params.set('sort', activeSort);
    setTempMinPrice(0);
    setTempMaxPrice(maxPriceLimit);
    startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
        setMobileFiltersOpen(false); 
        scrollToProducts();
    });
  };

  const handleCategoryChange = (slug: string) => updateFilter('category', slug);
  const handleAttrChange = (taxName: string, slug: string) => updateFilter(taxName, slug);
  const handleSortChange = (sortValue: string) => updateFilter('sort', sortValue); 

  const filtersActive = activeCategory !== 'all' || urlMinPrice > 0 || urlMaxPrice < maxPriceLimit || attributes?.some(attr => getActiveAttr(attr.taxonomyName) !== 'all');
  const availableCategories = categories.filter(c => c.count && c.count > 0);
  const isColorAttribute = (taxName: string) => {
      const lower = taxName.toLowerCase();
      return lower.includes('color') || lower.includes('feri') || lower.includes('colour');
  };

  const sortOptions = [
    { value: 'DATE_DESC', label: t('Sort.newest') },
    { value: 'POPULARITY_DESC', label: t('Sort.popularity') },
    { value: 'PRICE_ASC', label: t('Sort.priceLowHigh') },
    { value: 'PRICE_DESC', label: t('Sort.priceHighLow') },
  ];

  const activeBadges = [];
  if (activeCategory !== 'all') {
    const cat = categories.find(c => c.slug === activeCategory);
    activeBadges.push({ key: 'category', label: cat?.name || activeCategory });
  }
  attributes?.forEach(attr => {
    const val = searchParams.get(attr.taxonomyName);
    if (val && val !== 'all') {
        const term = attr.terms.find(t => t.slug === val);
        activeBadges.push({ key: attr.taxonomyName, label: term?.name || val });
    }
  });
  if (urlMinPrice > 0 || urlMaxPrice < maxPriceLimit) {
    activeBadges.push({ key: 'price', label: `${urlMinPrice}₾ - ${urlMaxPrice}₾` });
  }
  
  return (
    <>
      {/* --- MOBILE FILTERS OVERLAY --- */}
      <div className={`fixed inset-0 bg-black/60 z-[90] transition-opacity duration-300 md:hidden ${mobileFiltersOpen ? 'opacity-100 visible' : 'invisible'}`} onClick={() => setMobileFiltersOpen(false)}>
        <div className={`absolute right-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-white shadow-2xl transform transition-transform duration-300 flex flex-col h-full ${mobileFiltersOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={(e) => e.stopPropagation()}>
            
            {/* Mobile Filter Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-white">
                <h3 className="font-serif font-bold text-xl text-brand-dark">{t('filters.title')}</h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full cursor-pointer transition"><X className="w-6 h-6" /></button>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-8">
                {/* Price Filter */}
                <div>
                  <h4 className="font-bold mb-3 uppercase text-[11px] tracking-widest text-brand-dark">ფასით გაფილტვრა</h4>
                  <PriceFilter minPrice={tempMinPrice} maxPrice={tempMaxPrice} setMinPrice={setTempMinPrice} setMaxPrice={setTempMaxPrice} applyFilter={applyPriceFilter} maxLimit={maxPriceLimit} />
                </div>

                {/* Categories */}
                <div>
                    <h4 className="font-bold mb-3 uppercase text-[11px] tracking-widest text-brand-dark">{t('filters.categories')}</h4>
                    <div className="space-y-3"> 
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${activeCategory === 'all' ? 'border-brand-DEFAULT' : 'border-gray-300'}`}>
                                {activeCategory === 'all' && <div className="w-2 h-2 bg-brand-DEFAULT rounded-full" />}
                            </div>
                            <input type="radio" name="mobile_cat" className="hidden" checked={activeCategory === 'all'} onChange={() => handleCategoryChange('all')} />
                            <span className={`text-sm transition-colors ${activeCategory === 'all' ? 'font-bold text-brand-dark' : 'text-gray-600'}`}>{t('filters.all')}</span>
                        </label>
                        {availableCategories.map((cat) => (
                            <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${activeCategory === cat.slug ? 'border-brand-DEFAULT' : 'border-gray-300'}`}>
                                    {activeCategory === cat.slug && <div className="w-2 h-2 bg-brand-DEFAULT rounded-full" />}
                                </div>
                                <input type="radio" name="mobile_cat" className="hidden" checked={activeCategory === cat.slug} onChange={() => handleCategoryChange(cat.slug)} />
                                <div className="flex items-center justify-between w-full">
                                    <span className={`text-sm truncate mr-1 transition-colors ${activeCategory === cat.slug ? 'font-bold text-brand-dark' : 'text-gray-600'}`}>{cat.name}</span>
                                    <span className="text-[10px] text-gray-400 font-bold bg-gray-50 px-1.5 rounded">{cat.count}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Attributes */}
                {attributes?.map((attr) => (
                    <div key={attr.taxonomyName}>
                        <h4 className="font-bold mb-3 uppercase text-[11px] tracking-widest text-brand-dark">{attr.label}</h4>
                        {isColorAttribute(attr.taxonomyName) ? (
                            <div className="flex flex-wrap gap-2">
                                <button onClick={() => handleAttrChange(attr.taxonomyName, 'all')} className={`px-3 py-1.5 text-[10px] border rounded-full transition cursor-pointer font-bold ${getActiveAttr(attr.taxonomyName) === 'all' ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white hover:border-brand-dark text-gray-600'}`}>{t('filters.all')}</button>
                                {attr.terms.map((term) => (
                                    <button key={term.id} onClick={() => handleAttrChange(attr.taxonomyName, term.slug)} className={`w-8 h-8 rounded-full border-2 transition transform hover:scale-110 cursor-pointer relative ${getActiveAttr(attr.taxonomyName) === term.slug ? 'border-brand-DEFAULT ring-2 ring-brand-light ring-offset-1' : 'border-gray-200'}`} style={{ backgroundColor: colorMap[term.slug.toLowerCase()] || '#e5e7eb' }} title={term.name}>
                                        {getActiveAttr(attr.taxonomyName) === term.slug && <Check className="w-3 h-3 text-white absolute inset-0 m-auto mix-blend-difference" />}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {attr.terms.map((term) => (
                                    <label key={term.id} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${getActiveAttr(attr.taxonomyName) === term.slug ? 'border-brand-DEFAULT' : 'border-gray-300'}`}>
                                            {getActiveAttr(attr.taxonomyName) === term.slug && <div className="w-2.5 h-2.5 bg-brand-DEFAULT rounded-full" />}
                                        </div>
                                        <input type="radio" name={`mobile_${attr.taxonomyName}`} className="hidden" checked={getActiveAttr(attr.taxonomyName) === term.slug} onChange={() => handleAttrChange(attr.taxonomyName, term.slug)} />
                                        <div className="flex items-center justify-between w-full">
                                            <span className={`text-sm truncate mr-1 transition-colors ${getActiveAttr(attr.taxonomyName) === term.slug ? 'font-bold text-brand-dark' : 'text-gray-600'}`}>{term.name}</span>
                                            <span className="text-[10px] text-gray-400 font-bold bg-gray-50 px-1.5 rounded">{term.count}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Sticky Footer Actions */}
            <div className="p-4 border-t border-gray-100 bg-white space-y-3 z-10">
                <button onClick={() => setMobileFiltersOpen(false)} className="w-full bg-brand-dark text-white py-3.5 rounded-xl font-bold cursor-pointer shadow-lg active:scale-95 transition text-sm">{tCommon('showResults')}</button>
                <button onClick={handleClearFilters} disabled={!filtersActive} className={`w-full py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 text-sm cursor-pointer ${filtersActive ? 'bg-gray-100 text-red-500 hover:bg-red-50' : 'bg-gray-50 text-gray-300 cursor-not-allowed'}`}><RefreshCcw className="w-3.5 h-3.5" /> {tCommon('clearFilters')}</button>
            </div>
        </div>
      </div>

      {/* --- PAGE HEADER (Compact Mobile) --- */}
      <div className="container mx-auto px-4 mb-6 md:mb-8 mt-4 md:mt-0" ref={productsTopRef}>
          <div className="flex md:hidden items-center justify-between gap-4 mb-6">
              <div>
                  <h1 className="text-2xl font-serif font-black text-brand-dark">{t('title')}</h1>
                  <p className="text-gray-400 text-xs mt-1">
                    {t('productsCount', { count: initialProducts.length })}
                    {isPending && <span className="text-brand-DEFAULT ml-2 animate-pulse">{tCommon('loading')}</span>}
                  </p>
              </div>
              <button onClick={() => setMobileFiltersOpen(true)} className="bg-brand-dark text-white p-3 rounded-xl shadow-lg active:scale-95 transition cursor-pointer flex items-center justify-center">
                  <SlidersHorizontal className="w-5 h-5" />
              </button>
          </div>

          <div className="hidden md:flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-100 pb-8">
              <div>
                  <span className="text-brand-DEFAULT text-xs font-bold tracking-widest uppercase mb-2 block">2025</span>
                  <h1 className="text-4xl md:text-6xl font-serif font-black text-brand-dark">{t('title')}</h1>
                  <p className="text-gray-400 mt-2 text-sm">
                    {t('productsCount', { count: initialProducts.length })}
                    {isPending && <span className="text-brand-DEFAULT ml-2 animate-pulse">{tCommon('loading')}</span>}
                  </p>
              </div>
              
              <div className="relative flex-1 md:flex-none" ref={sortDropdownRef}> 
                  <button onClick={() => setIsSortOpen(prev => !prev)} className="w-full md:w-auto bg-white border border-gray-200 text-brand-dark py-3 px-6 pr-10 rounded-xl font-bold outline-none focus:border-brand-DEFAULT cursor-pointer shadow-sm flex items-center justify-between hover:border-gray-300 transition">
                      {sortOptions.find(o => o.value === activeSort)?.label || sortOptions[0].label}
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''} ml-2`} />
                  </button>
                  {isSortOpen && (
                      <div className="absolute right-0 mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-30 animate-fade-in"> 
                          {sortOptions.map(option => (
                              <button key={option.value} onClick={() => { handleSortChange(option.value); setIsSortOpen(false); }} className={`w-full px-5 py-3 text-sm text-left transition text-brand-dark cursor-pointer ${option.value === activeSort ? 'bg-brand-light font-bold text-brand-DEFAULT' : 'hover:bg-gray-50'}`}>{option.label}</button>
                          ))}
                      </div>
                  )}
              </div>
          </div>
      </div>

      <div className="container mx-auto px-4 flex gap-12 relative mt-2 md:mt-8">
        {/* --- SIDEBAR (Desktop) --- */}
        <div className="hidden md:block w-1/4 sticky top-28 h-[calc(100vh-8rem)]"> 
            <div className="bg-white pt-4 pb-4 border-b border-gray-100 px-4">
                <button onClick={handleClearFilters} disabled={!filtersActive} className={`w-full py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 cursor-pointer ${filtersActive ? 'bg-brand-DEFAULT text-white hover:bg-brand-dark' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}><RefreshCcw className="w-4 h-4" /> {tCommon('clearFilters')}</button>
            </div>
            <aside className="space-y-10 overflow-y-auto pr-4 pt-6 pb-24 h-full hide-scrollbar"> 
                {/* Price */}
                <div>
                    <button className="flex justify-between items-center w-full font-bold uppercase text-xs tracking-widest text-brand-dark border-b border-gray-100 pb-2 mb-6 cursor-pointer" onClick={() => setIsPriceOpen(!isPriceOpen)}>
                        ფასით გაფილტვრა
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isPriceOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isPriceOpen && <PriceFilter minPrice={tempMinPrice} maxPrice={tempMaxPrice} setMinPrice={setTempMinPrice} setMaxPrice={setTempMaxPrice} applyFilter={applyPriceFilter} maxLimit={maxPriceLimit} />}
                </div>

                {/* Categories */}
                <div>
                    <button className="flex justify-between items-center w-full font-bold uppercase text-xs tracking-widest text-brand-dark border-b border-gray-100 pb-2 mb-6 cursor-pointer" onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}>
                        {t('filters.categories')}
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isCategoriesOpen && (
                        <div className="space-y-3 animate-fade-in">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${activeCategory === 'all' ? 'border-brand-DEFAULT' : 'border-gray-300'}`}>
                                    {activeCategory === 'all' && <div className="w-2 h-2 bg-brand-DEFAULT rounded-full" />}
                                </div>
                                <input type="radio" name="cat_radio" className="hidden" checked={activeCategory === 'all'} onChange={() => handleCategoryChange('all')} />
                                <span className={`text-sm transition-colors ${activeCategory === 'all' ? 'font-bold text-brand-dark' : 'text-gray-600'}`}>{t('filters.all')}</span>
                            </label>
                            {availableCategories.map((cat) => (
                                <label key={cat.id} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${activeCategory === cat.slug ? 'border-brand-DEFAULT' : 'border-gray-300'}`}>
                                            {activeCategory === cat.slug && <div className="w-2 h-2 bg-brand-DEFAULT rounded-full" />}
                                        </div>
                                        <input type="radio" name="cat_radio" className="hidden" checked={activeCategory === cat.slug} onChange={() => handleCategoryChange(cat.slug)} />
                                        <span className={`text-sm transition-colors ${activeCategory === cat.slug ? 'font-bold text-brand-dark' : 'text-gray-600'}`}>{cat.name}</span>
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-bold bg-gray-50 px-1.5 py-0.5 rounded">{cat.count}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Attributes */}
                {attributes?.map((attr) => (
                    <div key={attr.taxonomyName}>
                        <button className="flex justify-between items-center w-full font-bold uppercase text-xs tracking-widest text-brand-dark border-b border-gray-100 pb-2 mb-6 cursor-pointer" onClick={() => toggleSection(attr.taxonomyName)}>
                            {attr.label}
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openSections[attr.taxonomyName] ? 'rotate-180' : ''}`} />
                        </button>
                        {openSections[attr.taxonomyName] && (
                            <div className="animate-fade-in mb-8">
                                {isColorAttribute(attr.taxonomyName) ? (
                                    <div className="flex flex-wrap gap-2">
                                        <button onClick={() => handleAttrChange(attr.taxonomyName, 'all')} className={`px-3 py-1 text-xs border rounded-full transition cursor-pointer font-bold ${getActiveAttr(attr.taxonomyName) === 'all' ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white hover:border-brand-dark text-gray-600'}`}>{t('filters.all')}</button>
                                        {attr.terms.map((term) => (
                                            <button key={term.id} onClick={() => handleAttrChange(attr.taxonomyName, term.slug)} className={`w-8 h-8 rounded-full border-2 transition transform hover:scale-110 cursor-pointer relative ${getActiveAttr(attr.taxonomyName) === term.slug ? 'border-brand-DEFAULT ring-2 ring-brand-light ring-offset-2' : 'border-gray-100'}`} style={{ backgroundColor: colorMap[term.slug.toLowerCase()] || '#e5e7eb' }} title={term.name}>
                                                {getActiveAttr(attr.taxonomyName) === term.slug && <Check className="w-3 h-3 text-white absolute inset-0 m-auto mix-blend-difference" />}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {attr.terms.map((term) => (
                                            <label key={term.id} className="flex items-center justify-between group cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${getActiveAttr(attr.taxonomyName) === term.slug ? 'border-brand-DEFAULT' : 'border-gray-300'}`}>
                                                        {getActiveAttr(attr.taxonomyName) === term.slug && <div className="w-2 h-2 bg-brand-DEFAULT rounded-full" />}
                                                    </div>
                                                    <input type="radio" name={attr.taxonomyName} className="hidden" checked={getActiveAttr(attr.taxonomyName) === term.slug} onChange={() => handleAttrChange(attr.taxonomyName, term.slug)} />
                                                    <span className={`text-sm transition-colors ${getActiveAttr(attr.taxonomyName) === term.slug ? 'font-bold text-brand-dark' : 'text-gray-600'}`}>{term.name}</span>
                                                </div>
                                                <span className="text-[10px] text-gray-400 font-bold bg-gray-50 px-1.5 py-0.5 rounded">{term.count}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </aside>
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="flex-1">
            {/* Active Filters Row */}
            {activeBadges.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-6 animate-fade-in">
                    {activeBadges.map((badge) => (
                        <button 
                            key={badge.key}
                            onClick={() => badge.key === 'price' ? (removeFilterBadge('minPrice'), removeFilterBadge('maxPrice')) : removeFilterBadge(badge.key)}
                            className="flex items-center gap-1.5 bg-gray-50 text-brand-dark pl-3 pr-2 py-1.5 rounded-full text-[11px] font-bold border border-gray-200 hover:border-red-300 hover:text-red-500 transition group cursor-pointer"
                        >
                            {badge.label}
                            <X className="w-3 h-3 text-gray-400 group-hover:text-red-500 transition" />
                        </button>
                    ))}
                    <button onClick={handleClearFilters} className="text-[11px] text-red-500 font-bold hover:underline transition ml-2 cursor-pointer">
                        {tCommon('clearFilters')}
                    </button>
                </div>
            )}

            <div className={`grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-6 md:gap-8 transition-opacity duration-300 ${isPending ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
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
                        stockQuantity={product.stockQuantity}
                        stockStatus={product.stockStatus}
                        locale={locale}
                        onQuickView={() => setSelectedProduct(product)}
                    />
                ))}
            </div>
            
            {initialProducts.length === 0 && (
                <div className="text-center py-20 text-gray-400 bg-gray-50 rounded-3xl mx-4 md:mx-0">
                    <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-medium">{t('notFound')}</p>
                    <button onClick={handleClearFilters} className="mt-3 text-brand-DEFAULT font-bold hover:underline text-xs cursor-pointer transition">{tCommon('clearFilters')}</button>
                </div>
            )}
        </div>
      </div>

      <QuickView 
        product={selectedProduct} 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </>
  );
}