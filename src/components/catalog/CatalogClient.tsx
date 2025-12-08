'use client';

import { useState, useMemo, useEffect } from 'react';
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
  sizes: FilterTerm[];
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
  
  // ✅ Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState(false); // ანიმაციისთვის
  const addItem = useCartStore((state) => state.addItem);

  // მოდალის გახსნა
  const openQuickView = (product: Product) => {
    setSelectedProduct(product);
    setTimeout(() => setModalVisible(true), 10);
    document.body.style.overflow = 'hidden';
  };

  // მოდალის დახურვა
  const closeQuickView = () => {
    setModalVisible(false);
    setTimeout(() => {
        setSelectedProduct(null);
        document.body.style.overflow = 'auto';
    }, 200); // დაველოდოთ ანიმაციას
  };

  // კალათაში დამატება მოდალიდან
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

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const categoryMatch = selectedCategory === 'all' 
        ? true 
        : product.productCategories?.nodes.some(c => c.slug === selectedCategory);

      const colorMatch = selectedColor === 'all'
        ? true
        : product.attributes?.nodes.some(attr => {
            if (attr.name !== 'pa_color') return false;
            return attr.options?.some(opt => opt.toLowerCase() === selectedColor.toLowerCase());
          });

      const sizeMatch = selectedSize === 'all'
        ? true
        : product.attributes?.nodes.some(attr => {
            if (attr.name !== 'pa_masala') return false;
            return attr.options?.some(opt => opt.toLowerCase() === selectedSize.toLowerCase());
          });

      const productPrice = parsePrice(product.price);
      const priceMatch = productPrice <= maxPrice;

      return categoryMatch && colorMatch && sizeMatch && priceMatch;
    });
  }, [initialProducts, selectedCategory, selectedColor, selectedSize, maxPrice]);

  return (
    <>
      {/* --- QUICK VIEW MODAL (ზუსტად HTML-დან) --- */}
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
                
                {/* მარცხენა მხარე: სურათი */}
                <div className="w-full md:w-1/2 bg-gray-50 relative min-h-[300px]">
                    <Image 
                        src={selectedProduct.image?.sourceUrl || '/placeholder.jpg'} 
                        alt={selectedProduct.name}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* მარჯვენა მხარე: ინფორმაცია */}
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

                        {/* ფერების არჩევა მოდალში */}
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
                {/* Categories */}
                <div>
                    <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-brand-dark">კატეგორიები</h4>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input 
                                type="checkbox" 
                                checked={selectedCategory === 'all'} 
                                onChange={() => setSelectedCategory('all')}
                                className="w-5 h-5 rounded border-gray-300 text-brand-DEFAULT focus:ring-brand-DEFAULT" 
                            />
                            <span className="text-gray-600 group-hover:text-brand-dark transition">ყველა</span>
                        </label>
                        {categories.map((cat) => (
                            <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    checked={selectedCategory === cat.slug}
                                    onChange={() => setSelectedCategory(selectedCategory === cat.slug ? 'all' : cat.slug)}
                                    className="w-5 h-5 rounded border-gray-300 text-brand-DEFAULT focus:ring-brand-DEFAULT"
                                />
                                <span className="text-gray-600 group-hover:text-brand-dark transition">{cat.name}</span>
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
                <div>
                    <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-brand-dark">ფერი</h4>
                    <div className="flex flex-wrap gap-4">
                        <button onClick={() => setSelectedColor('all')} className={`px-3 py-1 text-xs border rounded-full transition ${selectedColor === 'all' ? 'bg-brand-dark text-white' : 'bg-white'}`}>All</button>
                        {colors.map((color) => (
                            <button
                                key={color.id}
                                onClick={() => setSelectedColor(selectedColor === color.slug ? 'all' : color.slug)}
                                className={`w-8 h-8 rounded-full border-2 border-gray-200 transition duration-150 transform hover:scale-110 ${selectedColor === color.slug ? 'color-swatch-selected' : ''}`}
                                style={{ backgroundColor: colorMap[color.slug] || '#e5e7eb' }}
                            />
                        ))}
                    </div>
                </div>

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
        <aside className="hidden md:block w-1/4 space-y-10 sticky top-32 h-fit">
            <div>
                <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-brand-dark border-b border-gray-100 pb-2">{locale === 'ka' ? 'კატეგორიები' : 'Categories'}</h4>
                <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" checked={selectedCategory === 'all'} onChange={() => setSelectedCategory('all')} className="w-5 h-5 rounded border-gray-300 text-brand-DEFAULT focus:ring-brand-DEFAULT shadow-sm" />
                        <span className="text-gray-600 group-hover:text-brand-dark transition font-medium">{locale === 'ka' ? 'ყველა' : 'All'}</span>
                    </label>
                    {categories.map((cat) => (
                        <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" checked={selectedCategory === cat.slug} onChange={() => setSelectedCategory(selectedCategory === cat.slug ? 'all' : cat.slug)} className="w-5 h-5 rounded border-gray-300 text-brand-DEFAULT focus:ring-brand-DEFAULT shadow-sm" />
                            <span className="text-gray-600 group-hover:text-brand-dark transition font-medium">{cat.name}</span>
                            <span className="ml-auto text-xs text-gray-400 font-bold bg-gray-50 px-2 py-1 rounded">{cat.count || 0}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-brand-dark border-b border-gray-100 pb-2">{locale === 'ka' ? 'ფასი' : 'Price'}</h4>
                <div className="px-2">
                    <input type="range" className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-DEFAULT" min="0" max="5000" step="50" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />
                    <div className="flex justify-between mt-3 text-sm font-bold text-gray-500"><span>0 ₾</span><span>{maxPrice} ₾</span></div>
                </div>
            </div>

            <div>
                <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-brand-dark border-b border-gray-100 pb-2">{locale === 'ka' ? 'ფერი' : 'Color'}</h4>
                <div className="flex flex-wrap gap-4">
                    <button onClick={() => setSelectedColor('all')} className={`px-3 py-1 text-xs border rounded-full transition ${selectedColor === 'all' ? 'bg-brand-dark text-white' : 'bg-white hover:border-brand-dark'}`}>All</button>
                    {colors.map((color) => (
                        <button key={color.id} onClick={() => setSelectedColor(selectedColor === color.slug ? 'all' : color.slug)} className={`w-8 h-8 rounded-full border-2 border-gray-200 transition duration-150 transform hover:scale-110 ${selectedColor === color.slug ? 'color-swatch-selected' : ''}`} style={{ backgroundColor: colorMap[color.slug] || '#e5e7eb' }} title={color.name} />
                    ))}
                </div>
            </div>

            <div>
                <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-brand-dark border-b border-gray-100 pb-2">{locale === 'ka' ? 'მასალა' : 'Material'}</h4>
                <div className="space-y-3">
                    {sizes.map((size) => (
                        <label key={size.id} className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" checked={selectedSize === size.slug} onChange={() => setSelectedSize(selectedSize === size.slug ? 'all' : size.slug)} className="w-5 h-5 rounded border-gray-300 text-brand-DEFAULT focus:ring-brand-DEFAULT shadow-sm" />
                            <span className="text-gray-600 group-hover:text-brand-dark transition font-medium">{size.name}</span>
                        </label>
                    ))}
                </div>
            </div>
        </aside>

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
                        onQuickView={() => openQuickView(product)} // ✅ მოდალის გახსნის ფუნქცია
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