'use client';

import { useState, useEffect, Suspense, useTransition, useRef } from 'react'; 
import { SlidersHorizontal, X, ChevronDown, ShoppingBag, RefreshCcw, Check } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import type { Product, Category, FilterTerm } from '@/types';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCartStore } from '@/store/cartStore'; 
import Image from 'next/image';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';

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

// ფასის ფილტრის ცალკე კომპონენტი (ინპუტიდან ფოკუსის დაკარგვის თავიდან ასაცილებლად)
const PriceFilter = ({ 
    minPrice, maxPrice, setMinPrice, setMaxPrice, applyFilter, maxLimit 
}: { 
    minPrice: number, maxPrice: number, setMinPrice: (v: number) => void, setMaxPrice: (v: number) => void, applyFilter: () => void, maxLimit: number 
}) => {
    return (
        <div className="px-2 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₾</span>
                    <input 
                      type="number" 
                      value={minPrice === 0 ? '' : minPrice} 
                      onChange={(e) => setMinPrice(Number(e.target.value))} 
                      className="w-full border border-gray-200 bg-gray-50 rounded-lg pl-6 pr-2 py-2 text-sm font-bold text-brand-dark focus:border-brand-DEFAULT focus:ring-1 focus:ring-brand-DEFAULT outline-none transition" 
                      placeholder="0"
                      min="0"
                    />
                </div>
                <span className="text-gray-400">-</span>
                <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₾</span>
                    <input 
                      type="number" 
                      value={maxPrice === maxLimit ? '' : maxPrice} 
                      onChange={(e) => setMaxPrice(Number(e.target.value))} 
                      className="w-full border border-gray-200 bg-gray-50 rounded-lg pl-6 pr-2 py-2 text-sm font-bold text-brand-dark focus:border-brand-DEFAULT focus:ring-1 focus:ring-brand-DEFAULT outline-none transition" 
                      placeholder={String(maxLimit)}
                      max={maxLimit}
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
            
            <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400 mb-4">
                <span>0 ₾</span>
                <span>{maxLimit} ₾</span>
            </div>

            <button 
                onClick={applyFilter}
                className="w-full bg-brand-dark text-white py-2.5 rounded-lg text-sm font-bold hover:bg-brand-DEFAULT transition shadow-sm active:scale-95 flex items-center justify-center gap-2"
            >
                <Check className="w-4 h-4" /> გაფილტვრა
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
  const tProduct = useTranslations('Product');
  const tCommon = useTranslations('Common');
  
  const sortDropdownRef = useRef<HTMLDivElement>(null); 

  const urlMinPrice = Number(searchParams.get('minPrice')) || 0;
  const urlMaxPrice = Number(searchParams.get('maxPrice')) || maxPriceLimit;

  // ლოკალური სტეიტი (არ იწვევს რენდერს მშობელში, სანამ არ გაიგზავნება)
  const [tempMinPrice, setTempMinPrice] = useState(urlMinPrice);
  const [tempMaxPrice, setTempMaxPrice] = useState(urlMaxPrice);
  
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isPending, startTransition] = useTransition(); 

  const activeSort = searchParams.get('sort') || 'DATE_DESC'; 
  const activeCategory = searchParams.get('category') || 'all';

  const getActiveAttr = (taxName: string) => searchParams.get(taxName) || 'all';

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true); 
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [isSortOpen, setIsSortOpen] = useState(false);

  // URL-ის ცვლილებაზე განვაახლოთ ინპუტებიც (მაგ. Clear Filters-ის დროს)
  useEffect(() => {
    setTempMinPrice(urlMinPrice);
    setTempMaxPrice(urlMaxPrice);
  }, [urlMinPrice, urlMaxPrice]);

  useEffect(() => {
    document.body.style.overflow = (modalVisible || mobileFiltersOpen) ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [modalVisible, mobileFiltersOpen]);
  
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

  const updateFilter = (key: string, value: string | number) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === 'all' || value === 0 || (key === 'sort' && value === 'DATE_DESC')) { 
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
    
    startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  // ✅ ფასის გაფილტვრა (ღილაკზე დაჭერისას)
  const applyPriceFilter = () => {
      const params = new URLSearchParams(searchParams.toString());
      
      let finalMin = tempMinPrice < 0 ? 0 : tempMinPrice;
      let finalMax = tempMaxPrice > maxPriceLimit ? maxPriceLimit : tempMaxPrice;
      
      // თუ მინიმუმი მეტია მაქსიმუმზე, ვასწორებთ
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
    });
  };

  const handleCategoryChange = (slug: string) => updateFilter('category', activeCategory === slug ? 'all' : slug);
  const handleAttrChange = (taxName: string, slug: string) => updateFilter(taxName, getActiveAttr(taxName) === slug ? 'all' : slug);
  const handleSortChange = (sortValue: string) => updateFilter('sort', sortValue); 

  const openQuickView = (product: Product) => { setSelectedProduct(product); setTimeout(() => setModalVisible(true), 10); };
  const closeQuickView = () => { setModalVisible(false); setTimeout(() => { setSelectedProduct(null); }, 200); };
  
  const handleAddToCartFromModal = () => { 
      if (selectedProduct) { 
          addItem({ 
              id: selectedProduct.databaseId, 
              name: selectedProduct.name, 
              price: selectedProduct.salePrice || selectedProduct.price, 
              image: selectedProduct.image?.sourceUrl || '/placeholder.jpg', 
              slug: selectedProduct.slug,
              stockQuantity: selectedProduct.stockQuantity
          }); 
          closeQuickView(); 
      } 
  };
  
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
  
  const isSelectedProductOutOfStock = !!(selectedProduct && (selectedProduct.stockQuantity === 0 || selectedProduct.stockStatus !== 'IN_STOCK'));

  return (
    <>
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
                        <div className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-4" dangerouslySetInnerHTML={{ __html: selectedProduct.shortDescription || selectedProduct.description || 'No description.' }} />
                        <div className="mb-6">
                            <span className="text-xs font-bold text-brand-dark uppercase mb-2 block">{t('filters.color')}</span>
                            <div className="flex gap-3">
                                {selectedProduct.attributes?.nodes
                                  .filter(a => ['pa_color', 'color', 'feri'].some(key => a.name.toLowerCase().includes(key)))
                                  .flatMap(a => a.options || [])
                                  .map((opt, i) => (
                                    <div key={i} className="w-8 h-8 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: colorMap[opt.toLowerCase()] || '#eee' }} title={opt} />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-gray-100 mt-6">
                        <button 
                            onClick={handleAddToCartFromModal}
                            disabled={isSelectedProductOutOfStock}
                            className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold hover:bg-brand-DEFAULT transition active:scale-95 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ShoppingBag className="w-5 h-5" /> 
                            {isSelectedProductOutOfStock ? tProduct('outOfStock') : tProduct('addToCart')}
                        </button>
                        <Link href={{ pathname: '/product/[slug]', params: { slug: selectedProduct.slug } }} className="w-full block text-center text-xs font-bold text-brand-dark mt-4 hover:underline uppercase tracking-wide">მთლიანი პროდუქტის ნახვა</Link>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* --- MOBILE FILTERS --- */}
      <div 
        id="filter-overlay" 
        className={`fixed inset-0 bg-black/60 z-[80] transition-opacity duration-300 md:hidden ${mobileFiltersOpen ? 'opacity-100 visible' : 'invisible'}`}
        onClick={() => setMobileFiltersOpen(false)} 
      >
        <div 
          className={`absolute right-0 top-0 bottom-0 w-[85%] bg-white p-6 overflow-y-auto hide-scrollbar transform transition-transform duration-300 ${mobileFiltersOpen ? 'translate-x-0' : 'translate-x-full'}`} 
          id="filter-content"
          onClick={(e) => e.stopPropagation()} 
        >
            <div className="flex justify-between items-center mb-8">
                <h3 className="font-serif font-bold text-2xl">{t('filters.title')}</h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="space-y-8">
                {/* Categories */}
                <div>
                    <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-brand-dark">{t('filters.categories')}</h4>
                    <div className="space-y-3"> 
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" checked={activeCategory === 'all'} onChange={() => handleCategoryChange('all')} className="w-5 h-5 rounded border-gray-300 text-brand-DEFAULT focus:ring-brand-DEFAULT" />
                            <span className="text-gray-600 group-hover:text-brand-dark transition">{t('filters.all')}</span>
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

                {/* Price */}
                <div>
                  <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-brand-dark">{t('filters.price')}</h4>
                  <PriceFilter 
                    minPrice={tempMinPrice} 
                    maxPrice={tempMaxPrice} 
                    setMinPrice={setTempMinPrice} 
                    setMaxPrice={setTempMaxPrice} 
                    applyFilter={applyPriceFilter}
                    maxLimit={maxPriceLimit}
                  />
                </div>

                {attributes?.map((attr) => (
                    <div key={attr.taxonomyName}>
                        <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-brand-dark">{attr.label}</h4>
                        {isColorAttribute(attr.taxonomyName) ? (
                            <div className="flex flex-wrap gap-3">
                                <button onClick={() => handleAttrChange(attr.taxonomyName, 'all')} className={`px-3 py-1 text-xs border rounded-full transition cursor-pointer ${getActiveAttr(attr.taxonomyName) === 'all' ? 'bg-brand-dark text-white' : 'bg-white hover:border-brand-dark'}`}>{t('filters.all')}</button>
                                {attr.terms.map((term) => (
                                    <button 
                                      key={term.id} 
                                      onClick={() => handleAttrChange(attr.taxonomyName, term.slug)} 
                                      className={`w-8 h-8 rounded-full border-2 border-gray-200 transition duration-150 transform hover:scale-110 cursor-pointer ${getActiveAttr(attr.taxonomyName) === term.slug ? 'ring-2 ring-brand-DEFAULT scale-110' : ''}`} 
                                      style={{ backgroundColor: colorMap[term.slug.toLowerCase()] || '#e5e7eb' }} 
                                      title={term.name} 
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {attr.terms.map((term) => (
                                    <label key={term.id} className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" checked={getActiveAttr(attr.taxonomyName) === term.slug} onChange={() => handleAttrChange(attr.taxonomyName, term.slug)} className="w-5 h-5 rounded border-gray-300 text-brand-DEFAULT focus:ring-brand-DEFAULT shadow-sm flex-shrink-0" />
                                        <div className="flex items-center justify-between w-full overflow-hidden">
                                            <span className="text-gray-600 group-hover:text-brand-dark transition font-medium text-sm truncate mr-1" title={term.name}>{term.name}</span>
                                            <span className="ml-auto text-xs text-gray-400 font-bold">{term.count}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                
                <button onClick={handleClearFilters} disabled={!filtersActive} className={`w-full py-3 rounded-xl font-bold mt-8 transition flex items-center justify-center gap-2 ${filtersActive ? 'bg-brand-DEFAULT text-white hover:bg-brand-dark' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>
                    <RefreshCcw className="w-4 h-4" /> {tCommon('clearFilters')}
                </button>
                
                <button onClick={() => setMobileFiltersOpen(false)} className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold mt-4">{tCommon('showResults')}</button>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-100 pb-8">
              <div>
                  <span className="text-brand-DEFAULT text-xs font-bold tracking-widest uppercase mb-2 block">2025</span>
                  <h1 className="text-4xl md:text-6xl font-serif font-black text-brand-dark">{t('title')}</h1>
                  <p className="text-gray-400 mt-2 text-sm">
                    {t('productsCount', { count: initialProducts.length })}
                    {isPending && <span className="text-brand-DEFAULT ml-2 animate-pulse">{tCommon('loading')}</span>}
                  </p>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                  <button onClick={() => setMobileFiltersOpen(true)} className="md:hidden flex-1 bg-gray-100 text-brand-dark py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition"><SlidersHorizontal className="w-5 h-5" /> {t('filters.title')}</button>
                  
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

      <div className="container mx-auto px-4 flex gap-12 relative mt-8">
        <div className="hidden md:block w-1/4 sticky top-28 h-[calc(100vh-8rem)] relative"> 
            
            <div className="sticky top-0 z-10 bg-white pt-4 pb-4 border-b border-gray-100 -mx-4 px-4">
                <button onClick={handleClearFilters} disabled={!filtersActive} className={`w-full py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${filtersActive ? 'bg-brand-DEFAULT text-white hover:bg-brand-dark' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>
                    <RefreshCcw className="w-4 h-4" /> {tCommon('clearFilters')}
                </button>
            </div>

            <aside className="space-y-10 overflow-y-auto pr-4 pt-6 pb-24 h-full hide-scrollbar"> 
                
                <div>
                    <button 
                      className="flex justify-between items-center w-full font-bold uppercase text-xs tracking-widest text-brand-dark border-b border-gray-100 pb-2 mb-6 cursor-pointer"
                      onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                    >
                        {t('filters.categories')}
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isCategoriesOpen && (
                        <div className="grid grid-cols-2 gap-x-6 gap-y-3 animate-fade-in">
                            <label className="flex items-center gap-3 cursor-pointer group col-span-2">
                                <input type="checkbox" checked={activeCategory === 'all'} onChange={() => handleCategoryChange('all')} className="w-5 h-5 rounded border-gray-300 text-brand-DEFAULT focus:ring-brand-DEFAULT" />
                                <span className="text-gray-600 group-hover:text-brand-dark transition font-medium">{t('filters.all')}</span>
                            </label>
                            {availableCategories.map((cat) => (
                                <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" checked={activeCategory === cat.slug} onChange={() => handleCategoryChange(cat.slug)} className="w-5 h-5 rounded border-gray-300 text-brand-DEFAULT focus:ring-brand-DEFAULT" />
                                    <div className="flex items-center justify-between w-full overflow-hidden">
                                        <span className="text-gray-600 group-hover:text-brand-dark transition font-medium text-sm truncate mr-1" title={cat.name}>{cat.name}</span>
                                        <span className="text-[10px] text-gray-400 font-bold bg-gray-50 px-1.5 py-0.5 rounded flex-shrink-0">{cat.count}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <button 
                      className="flex justify-between items-center w-full font-bold uppercase text-xs tracking-widest text-brand-dark border-b border-gray-100 pb-2 mb-6 cursor-pointer"
                      onClick={() => setIsPriceOpen(!isPriceOpen)}
                    >
                        {t('filters.price')}
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isPriceOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isPriceOpen && (
                        <PriceFilter 
                            minPrice={tempMinPrice} 
                            maxPrice={tempMaxPrice} 
                            setMinPrice={setTempMinPrice} 
                            setMaxPrice={setTempMaxPrice} 
                            applyFilter={applyPriceFilter}
                            maxLimit={maxPriceLimit}
                        />
                    )}
                </div>

                {attributes?.map((attr) => (
                    <div key={attr.taxonomyName}>
                        <button 
                            className="flex justify-between items-center w-full font-bold uppercase text-xs tracking-widest text-brand-dark border-b border-gray-100 pb-2 mb-6 cursor-pointer"
                            onClick={() => toggleSection(attr.taxonomyName)}
                        >
                            {attr.label}
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openSections[attr.taxonomyName] ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {openSections[attr.taxonomyName] && (
                            <div className="animate-fade-in mb-8">
                                {isColorAttribute(attr.taxonomyName) ? (
                                    <div className="flex flex-wrap gap-3">
                                        <button onClick={() => handleAttrChange(attr.taxonomyName, 'all')} className={`px-3 py-1 text-xs border rounded-full transition cursor-pointer ${getActiveAttr(attr.taxonomyName) === 'all' ? 'bg-brand-dark text-white' : 'bg-white hover:border-brand-dark'}`}>{t('filters.all')}</button>
                                        {attr.terms.map((term) => (
                                            <button 
                                                key={term.id} 
                                                onClick={() => handleAttrChange(attr.taxonomyName, term.slug)} 
                                                className={`w-8 h-8 rounded-full border-2 border-gray-200 transition duration-150 transform hover:scale-110 cursor-pointer ${getActiveAttr(attr.taxonomyName) === term.slug ? 'ring-2 ring-brand-DEFAULT scale-110' : ''}`} 
                                                style={{ backgroundColor: colorMap[term.slug.toLowerCase()] || '#e5e7eb' }} 
                                                title={term.name} 
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        {attr.terms.map((term) => (
                                            <label key={term.id} className="flex items-center gap-3 cursor-pointer group">
                                                <input type="checkbox" checked={getActiveAttr(attr.taxonomyName) === term.slug} onChange={() => handleAttrChange(attr.taxonomyName, term.slug)} className="w-5 h-5 rounded border-gray-300 text-brand-DEFAULT focus:ring-brand-DEFAULT shadow-sm flex-shrink-0" />
                                                <div className="flex items-center justify-between w-full overflow-hidden">
                                                    <span className="text-gray-600 group-hover:text-brand-dark transition font-medium text-sm truncate mr-1" title={term.name}>{term.name}</span>
                                                    <span className="text-[10px] text-gray-400 font-bold bg-gray-50 px-1.5 py-0.5 rounded flex-shrink-0">{term.count}</span>
                                                </div>
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
                        stockQuantity={product.stockQuantity}
                        stockStatus={product.stockStatus}
                        locale={locale}
                        onQuickView={() => openQuickView(product)}
                    />
                ))}
            </div>
            {initialProducts.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                    <p>{t('notFound')}</p>
                    <button onClick={() => updateFilter('category', 'all')} className="mt-4 text-brand-DEFAULT underline text-sm">{tCommon('clearFilters')}</button>
                </div>
            )}
        </div>
      </div>
    </>
  );
}