'use client';

import { useState, useMemo } from 'react';
import { SlidersHorizontal, X, ChevronDown, ShoppingBag } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import type { Product, Category, FilterTerm } from '@/types';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import { Link } from '@/navigation';

interface CatalogClientProps {
  initialProducts: Product[];
  categories: Category[];
  colors: FilterTerm[];
  sizes: FilterTerm[]; // რეალურად მასალები
  locale: string;
}

const parsePrice = (priceString: string | undefined | null): number => {
  if (!priceString) return 0;
  const matches = priceString.match(/(\d+\.?\d*)/g);
  if (!matches || matches.length === 0) return 0;
  const prices = matches.map(p => parseFloat(p));
  return Math.min(...prices);
};

const colorMap: Record<string, string> = {
  'shavi': '#000000', 'tetri': '#FFFFFF', 'lurji': '#2563EB', 'muqi_lurji': '#1E3A8A',
  'cisferi': '#60A5FA', 'beji': '#F5F5DC', 'yavisferi': '#8B4513', 'vardisferi': '#DB2777',
  'witeli': '#DC2626', 'mwvane': '#16A34A', 'stafilosferi': '#F97316', 'nacrisferi': '#9CA3AF',
  'vercxlisferi': '#C0C0C0', 'oqrosferi': '#FFD700', 'iasamnisferi': '#A855F7', 'kanisferi': '#FFE4C4'
};

export default function CatalogClient({ initialProducts, categories, colors, sizes, locale }: CatalogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const openQuickView = (product: Product) => {
    setSelectedProduct(product);
    setTimeout(() => setModalVisible(true), 10);
    document.body.style.overflow = 'hidden';
  };

  const closeQuickView = () => {
    setModalVisible(false);
    setTimeout(() => {
        setSelectedProduct(null);
        document.body.style.overflow = 'auto';
    }, 200);
  };

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

  // --- დამხმარე ფუნქციები ---
  const checkCategory = (p: Product, catSlug: string) => 
    catSlug === 'all' || p.productCategories?.nodes.some(c => c.slug === catSlug);

  const checkColor = (p: Product, colSlug: string) => 
    colSlug === 'all' || p.attributes?.nodes.some(attr => attr.name === 'pa_color' && attr.options?.some(opt => opt.toLowerCase() === colSlug.toLowerCase()));

  const checkSize = (p: Product, sizeSlug: string) => 
    sizeSlug === 'all' || p.attributes?.nodes.some(attr => attr.name === 'pa_masala' && attr.options?.some(opt => opt.toLowerCase() === sizeSlug.toLowerCase()));

  const checkPrice = (p: Product, max: number) => parsePrice(p.price) <= max;


  // ფუნქცია, რომელიც ითვლის პროდუქტებს კლიენტის მხარეს
  const getProductCounts = (products: Product[], type: 'category' | 'color' | 'size') => {
    const counts: Record<string, number> = {};
    products.forEach(p => {
        let terms: { slug: string }[] = [];
        
        if (type === 'category') {
            terms = p.productCategories?.nodes || [];
        } else if (type === 'color') {
            const colorAttr = p.attributes?.nodes.find(a => a.name === 'pa_color');
            terms = colorAttr?.options?.map(opt => ({ slug: opt.toLowerCase() })) || [];
        } else if (type === 'size') {
            const sizeAttr = p.attributes?.nodes.find(a => a.name === 'pa_masala');
            terms = sizeAttr?.options?.map(opt => ({ slug: opt.toLowerCase() })) || [];
        }

        terms.forEach(term => {
            const slug = term.slug;
            counts[slug] = (counts[slug] || 0) + 1;
        });
    });
    return counts;
  };

  
  // 1. ✅ მთავარი ფილტრაცია (პროდუქტების სია)
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(p => 
        checkCategory(p, selectedCategory) &&
        checkColor(p, selectedColor) &&
        checkSize(p, selectedSize) &&
        checkPrice(p, maxPrice)
    );
  }, [initialProducts, selectedCategory, selectedColor, selectedSize, maxPrice]);


  // --- დინამიური ფილტრები: სიის გენერაცია და დათვლა კლიენტის მხარეს ---
  
  // პროდუქტები, რომლებიც მხოლოდ ფასსა და კატეგორიას აკმაყოფილებენ (ფილტრების სიის გენერაციის ბაზა)
  const productsForFilterCounting = useMemo(() => {
    return initialProducts.filter(p => 
        checkCategory(p, selectedCategory) &&
        checkPrice(p, maxPrice)
    );
  }, [initialProducts, selectedCategory, maxPrice]);


  // 2. ✅ კატეგორიების რაოდენობის დათვლა (სტაბილური ლოგიკა)
  const allCategoryCounts = useMemo(() => getProductCounts(initialProducts, 'category'), [initialProducts]);
  const availableCategories = useMemo(() => {
    return categories
      // ვფილტრავთ მხოლოდ იმ კატეგორიებს, რომლებსაც ჩატვირთულ პროდუქტებში ჰყავთ 1+ პროდუქტი.
      .filter(c => (allCategoryCounts[c.slug.toLowerCase()] || 0) > 0)
      .map(c => ({ 
          ...c, 
          // ⚠️ რაოდენობის ველში ვიყენებთ კლიენტის მხარეს დათვლილ რიცხვს
          count: allCategoryCounts[c.slug.toLowerCase()] 
      }));
  }, [categories, allCategoryCounts]);

  
  // 3. ✅ ფერების სრული სია და დათვლა
  const availableColorCounts = useMemo(() => getProductCounts(productsForFilterCounting, 'color'), [productsForFilterCounting]);
  const availableColors = useMemo(() => {
    // ფილტრის სიაში ვტოვებთ მხოლოდ იმ ფერებს, რომლებიც ხელმისაწვდომია მიმდინარე კატეგორიასა და ფასში
    return colors
      .filter(c => (availableColorCounts[c.slug.toLowerCase()] || 0) > 0 || selectedColor === c.slug)
      .map(c => ({
          ...c,
          count: availableColorCounts[c.slug.toLowerCase()]
      }));
  }, [colors, availableColorCounts, selectedColor]);

  
  // 4. ✅ მასალების სრული სია და დათვლა
  const availableSizeCounts = useMemo(() => getProductCounts(productsForFilterCounting, 'size'), [productsForFilterCounting]);
  const availableSizes = useMemo(() => {
    // ფილტრის სიაში ვტოვებთ მხოლოდ იმ მასალებს, რომლებიც ხელმისაწვდომია მიმდინარე კატეგორიასა და ფასში
    return sizes
      .filter(s => (availableSizeCounts[s.slug.toLowerCase()] || 0) > 0 || selectedSize === s.slug)
      .map(s => ({
          ...s,
          count: availableSizeCounts[s.slug.toLowerCase()]
      }));
  }, [sizes, availableSizeCounts, selectedSize]);


  return (
    <>
      {/* --- QUICK VIEW MODAL (ლოგიკა უცვლელია) --- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={closeQuickView}></div>
            <div 
                className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[600px] transition-all duration-300 ${
                    modalVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
            >
                <button onClick={closeQuickView} className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-brand-light transition shadow-sm">
                    <X className="w-6 h-6 text-brand-dark" />
                </button>
                
                <div className="w-full md:w-1/2 bg-gray-50 relative min-h-[300px]">
                    <Image 
                        src={selectedProduct.image?.sourceUrl || '/placeholder.jpg'} 
                        alt={selectedProduct.name}
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">
                    <div className="mb-auto">
                        <span className="text-xs font-bold text-brand-DEFAULT uppercase tracking-wider mb-2 block">
                            {selectedProduct.productCategories?.nodes[0]?.name || 'Collection'}
                        </span>
                        <h2 className="text-3xl font-black text-brand-dark mb-2 leading-tight">{selectedProduct.name}</h2>
                        <p className="text-2xl font-black text-brand-dark mb-4">
                            {selectedProduct.salePrice || selectedProduct.price}
                        </p>
                        
                        <div 
                            className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-4"
                            dangerouslySetInnerHTML={{ __html: selectedProduct.shortDescription || selectedProduct.description || 'აღწერა არ არის.' }}
                        />

                        <div className="mb-6">
                            <span className="text-xs font-bold text-brand-dark uppercase mb-2 block">ფერი</span>
                            <div className="flex gap-3">
                                {selectedProduct.attributes?.nodes.find(a => a.name === 'pa_color')?.options?.map((opt, i) => (
                                    <div 
                                        key={i} 
                                        className="w-8 h-8 rounded-full border border-gray-200"
                                        style={{ backgroundColor: colorMap[opt.toLowerCase()] || '#eee' }}
                                        title={opt}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 mt-6">
                        <button 
                            onClick={handleAddToCartFromModal}
                            className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold hover:bg-brand-DEFAULT transition active:scale-95 shadow-lg flex items-center justify-center gap-2"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            კალათაში დამატება
                        </button>
                        <Link href={`/product/${selectedProduct.slug}`} className="w-full block text-center text-xs font-bold text-brand-dark mt-4 hover:underline uppercase tracking-wide">
                            სრული გვერდის ნახვა
                        </Link>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* --- MOBILE FILTERS --- */}
      <div className={`fixed inset-0 bg-black/60 z-[80] md:hidden transition-opacity duration-300 ${mobileFiltersOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setMobileFiltersOpen(false)}>
        <div 
            className={`absolute right-0 top-0 bottom-0 w-[80%] bg-white p-6 overflow-y-auto transform transition-transform duration-300 ${mobileFiltersOpen ? 'translate-x-0' : 'translate-x-full'}`}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex justify-between items-center mb-8">
                <h3 className="font-serif font-bold text-2xl">ფილტრაცია</h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                    <X className="w-6 h-6" />
                </button>
            </div>
            
            <div className="space-y-8">
                {/* Categories Mobile */}
                <div>
                    <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-brand-dark">კატეგორიები</h4>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                        <label className="flex items-center gap-3 cursor-pointer group col-span-2">
                            <input 
                                type="checkbox" 
                                checked={selectedCategory === 'all'} 
                                onChange={() => setSelectedCategory('all')}
                                className="w-5 h-5 rounded border-gray-300 text-brand-DEFAULT focus:ring-brand-DEFAULT" 
                            />
                            <span className="text-gray-600 group-hover:text-brand-dark transition">ყველა</span>
                        </label>
                        {availableCategories.map((cat) => (
                            <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    checked={selectedCategory === cat.slug}
                                    onChange={() => setSelectedCategory(selectedCategory === cat.slug ? 'all' : cat.slug)}
                                    className="w-5 h-5 rounded border-gray-300 text-brand-DEFAULT focus:ring-brand-DEFAULT"
                                />
                                <span className="text-gray-600 group-hover:text-brand-dark transition">{cat.name} ({cat.count})</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Price */}
                <div>
                    <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-brand-dark">ფასი</h4>
                    <div className="px-2">
                        <input 
                            type="range" 
                            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-DEFAULT" 
                            min="0" max="5000" step="10" 
                            value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))}
                        />
                        <div className="flex justify-between mt-3 text-sm font-bold text-gray-500">
                            <span>0 ₾</span>
                            <span>{maxPrice} ₾</span>
                        </div>
                    </div>
                </div>

                {/* Colors */}
                {availableColors.length > 0 && (
                    <div>
                        <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-brand-dark">ფერი</h4>
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => setSelectedColor('all')}
                                className={`px-3 py-1 text-xs border rounded-full transition ${selectedColor === 'all' ? 'bg-brand-dark text-white' : 'bg-white'}`}
                            >All</button>
                            {availableColors.map((color) => (
                                <button
                                    key={color.id}
                                    onClick={() => setSelectedColor(selectedColor === color.slug ? 'all' : color.slug)}
                                    className={`w-8 h-8 rounded-full border-2 border-gray-200 transition duration-150 transform hover:scale-110 ${
                                        selectedColor === color.slug ? 'color-swatch-selected' : ''
                                    }`}
                                    style={{ backgroundColor: colorMap[color.slug] || '#e5e7eb' }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <button onClick={() => setMobileFiltersOpen(false)} className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold mt-8">
                    შედეგების ჩვენება
                </button>
            </div>
        </div>
      </div>

      {/* --- DESKTOP HEADER & LAYOUT --- */}
      <div className="container mx-auto px-4 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-100 pb-8">
              <div>
                  <span className="text-brand-DEFAULT text-xs font-bold tracking-widest uppercase mb-2 block">2025 წლის კოლექცია</span>
                  <h1 className="text-4xl md:text-6xl font-serif font-black text-brand-dark">
                    {locale === 'ka' ? 'სრული კატალოგი' : 'Catalog'}
                  </h1>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                  <button onClick={() => setMobileFiltersOpen(true)} className="md:hidden flex-1 bg-gray-100 text-brand-dark py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition">
                      <SlidersHorizontal className="w-5 h-5" /> {locale === 'ka' ? 'ფილტრაცია' : 'Filter'}
                  </button>
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
        
        {/* SIDEBAR (DESKTOP) */}
        <aside className="hidden md:block w-1/4 space-y-10 sticky top-32 max-h-[calc(100vh-10rem)] overflow-y-auto pr-4 hide-scrollbar">
            
            {/* Categories */}
            <div>
                <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-brand-dark border-b border-gray-100 pb-2">
                    {locale === 'ka' ? 'კატეგორიები' : 'Categories'}
                </h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group col-span-2">
                        <input 
                            type="checkbox" 
                            checked={selectedCategory === 'all'}
                            onChange={() => setSelectedCategory('all')}
                            className="w-5 h-5 rounded border-gray-300 text-brand-DEFAULT focus:ring-brand-DEFAULT shadow-sm flex-shrink-0"
                        />
                        <span className="text-gray-600 group-hover:text-brand-dark transition font-medium">{locale === 'ka' ? 'ყველა' : 'All'}</span>
                    </label>
                    {availableCategories.map((cat) => (
                        <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                            <input 
                                type="checkbox"
                                checked={selectedCategory === cat.slug}
                                onChange={() => setSelectedCategory(selectedCategory === cat.slug ? 'all' : cat.slug)}
                                className="w-5 h-5 rounded border-gray-300 text-brand-DEFAULT focus:ring-brand-DEFAULT shadow-sm flex-shrink-0"
                            />
                            <div className="flex items-center justify-between w-full overflow-hidden">
                                <span className="text-gray-600 group-hover:text-brand-dark transition font-medium text-sm truncate mr-1" title={cat.name}>{cat.name}</span>
                                <span className="text-[10px] text-gray-400 font-bold bg-gray-50 px-1.5 py-0.5 rounded flex-shrink-0">{cat.count || 0}</span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

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
                        max="5000" 
                        step="50" 
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                    />
                    <div className="flex justify-between mt-3 text-sm font-bold text-gray-500">
                        <span>0 ₾</span>
                        <span>{maxPrice} ₾</span>
                    </div>
                </div>
            </div>

            {/* Colors */}
            {availableColors.length > 0 && (
                <div>
                    <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-brand-dark border-b border-gray-100 pb-2">
                        {locale === 'ka' ? 'ფერი' : 'Color'}
                    </h4>
                    <div className="flex flex-wrap gap-4">
                        <button
                             onClick={() => setSelectedColor('all')}
                             className={`px-3 py-1 text-xs border rounded-full transition ${selectedColor === 'all' ? 'bg-brand-dark text-white' : 'bg-white hover:border-brand-dark'}`}
                        >All</button>
                        {availableColors.map((color) => (
                            <button
                                key={color.id}
                                onClick={() => setSelectedColor(selectedColor === color.slug ? 'all' : color.slug)}
                                className={`w-8 h-8 rounded-full border-2 border-gray-200 transition duration-150 transform hover:scale-110 ${
                                    selectedColor === color.slug ? 'color-swatch-selected' : ''
                                }`}
                                style={{ backgroundColor: colorMap[color.slug] || '#e5e7eb' }}
                                title={color.name}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Materials - 2 სვეტად */}
            {availableSizes.length > 0 && (
                <div className="pb-10">
                    <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-brand-dark border-b border-gray-100 pb-2">
                        {locale === 'ka' ? 'მასალა' : 'Material'}
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                        {availableSizes.map((size) => (
                            <label key={size.id} className="flex items-center gap-3 cursor-pointer group">
                                <input 
                                    type="checkbox"
                                    checked={selectedSize === size.slug}
                                    onChange={() => setSelectedSize(selectedSize === size.slug ? 'all' : size.slug)}
                                    className="w-5 h-5 rounded border-gray-300 text-brand-DEFAULT focus:ring-brand-DEFAULT shadow-sm flex-shrink-0"
                                />
                                <div className="flex items-center justify-between w-full overflow-hidden">
                                     <span className="text-gray-600 group-hover:text-brand-dark transition font-medium truncate" title={size.name}>{size.name}</span>
                                     <span className="text-[10px] text-gray-400 font-bold bg-gray-50 px-1.5 py-0.5 rounded flex-shrink-0">{size.count}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </aside>

        {/* PRODUCT GRID */}
        <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 md:gap-8">
                {filteredProducts.map((product) => (
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
            
            {filteredProducts.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                    <p>{locale === 'ka' ? 'პროდუქტები არ მოიძებნა.' : 'No products found.'}</p>
                </div>
            )}
        </div>
      </div>
    </>
  );
}