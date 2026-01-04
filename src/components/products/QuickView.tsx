'use client';

import { X, ShoppingBag, Tag } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/navigation';
import { useCartStore } from '@/store/cartStore';
import { useTranslations } from 'next-intl';

interface QuickViewProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

const colorMap: Record<string, string> = { 
    'shavi': '#000000', 'black': '#000000', 'chernyj': '#000000', 'chernyy': '#000000',
    'tetri': '#FFFFFF', 'white': '#FFFFFF', 'belyj': '#FFFFFF', 'belyy': '#FFFFFF',
    'lurji': '#2563EB', 'blue': '#2563EB', 'sinij': '#2563EB', 'siniy': '#2563EB',
    'witeli': '#DC2626', 'tsiteli': '#DC2626', 'red': '#DC2626', 'krasnyj': '#DC2626', 'krasnyy': '#DC2626',
    'beji': '#F5F5DC', 'beige': '#F5F5DC', 'bezhevyj': '#F5F5DC', 'bezhevyy': '#F5F5DC',
    'yavisferi': '#8B4513', 'brown': '#8B4513', 'korichnevyj': '#8B4513', 'korichnevyy': '#8B4513',
    'vardisferi': '#DB2777', 'pink': '#DB2777', 'rozovyj': '#DB2777', 'rozovyy': '#DB2777',
    'mwvane': '#16A34A', 'green': '#16A34A', 'zelenyj': '#16A34A', 'zelenyy': '#16A34A',
    'stafilosferi': '#F97316', 'orange': '#F97316', 'oranzhevyj': '#F97316', 'oranzhevyy': '#F97316',
    'yviteli': '#FACC15', 'yellow': '#FACC15', 'zheltyj': '#FACC15', 'zheltyy': '#FACC15',
    'rcuxi': '#9CA3AF', 'nacrisferi': '#9CA3AF', 'grey': '#9CA3AF', 'gray': '#9CA3AF', 'seryj': '#9CA3AF', 'seryy': '#9CA3AF',
    'cisferi': '#60A5FA', 'light-blue': '#60A5FA', 'goluboj': '#60A5FA', 'goluboy': '#60A5FA',
    'muqi_lurji': '#1E3A8A', 'dark-blue': '#1E3A8A', 'temno-sinij': '#1E3A8A', 'temno-siniy': '#1E3A8A',
    'vercxlisferi': '#C0C0C0', 'silver': '#C0C0C0', 'serebristyj': '#C0C0C0', 'serebristyy': '#C0C0C0',
    'oqrosferi': '#FFD700', 'gold': '#FFD700', 'zolotistyj': '#FFD700', 'zolotistyy': '#FFD700',
    'iasamnisferi': '#A855F7', 'purple': '#A855F7', 'fioletovyj': '#A855F7', 'fioletovyy': '#A855F7',
    'kanisferi': '#FFE4C4', 'nude': '#FFE4C4', 'telesnyj': '#FFE4C4', 'telesnyy': '#FFE4C4',
    'cream': '#FFFDD0', 'kremovyj': '#FFFDD0', 'kremovyy': '#FFFDD0',
    'vardisferi_(pradas_stili)': '#DB2777', 'vardisferi-pradas-stili': '#DB2777'
};

const formatPriceValue = (priceString: string | null | undefined): string | null => {
    if (!priceString) return null;
    
    const matches = priceString.match(/(\d+\.?\d*)/g);
    if (!matches || matches.length === 0) return null;

    const uniquePrices = Array.from(new Set(matches.map(p => parseFloat(p))));
    uniquePrices.sort((a, b) => a - b);

    if (uniquePrices.length === 0) return null;
    
    if (uniquePrices.length === 1) {
        return `${uniquePrices[0]} ₾`;
    }
    
    return `${uniquePrices[0]} ₾ - ${uniquePrices[uniquePrices.length - 1]} ₾`;
};

const calculateDiscount = (regular: string | null, sale: string | null) => {
    if (!regular || !sale) return null;
    const regMatch = regular.match(/(\d+\.?\d*)/);
    const saleMatch = sale.match(/(\d+\.?\d*)/);
    
    if (regMatch && saleMatch) {
        const reg = parseFloat(regMatch[0]);
        const sal = parseFloat(saleMatch[0]);
        if (reg > sal) {
            return Math.round(((reg - sal) / reg) * 100);
        }
    }
    return null;
};

const getColorHex = (slug: string) => {
    if (!slug) return '#e5e7eb';
    const cleanSlug = slug.toLowerCase().replace(/-en|-ru|-ka|-ge/g, '').trim();
    return colorMap[cleanSlug] || colorMap[slug] || '#e5e7eb';
};

export default function QuickView({ product, isOpen, onClose }: QuickViewProps) {
  const addItem = useCartStore((state) => state.addItem);
  const tProduct = useTranslations('Product');
  const tToast = useTranslations('Toast');
  const tCatalog = useTranslations('Catalog');
  const tCommon = useTranslations('Common');

  if (!product) return null;

  const handleAddToCart = () => {
    const messages = {
        added: tToast('added', { name: product.name }),
        increased: tToast('quantityIncreased', { name: product.name }),
        stockError: tToast('stockError', { quantity: product.stockQuantity })
    };

    addItem({
      id: product.databaseId || product.id,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.image?.sourceUrl || product.image,
      slug: product.slug,
      stockQuantity: product.stockQuantity
    }, messages); 
    onClose();
  };

  const isOutOfStock = product.stockQuantity === 0 || product.stockStatus !== 'IN_STOCK';

  const displaySalePrice = formatPriceValue(product.salePrice);
  const displayRegularPrice = formatPriceValue(product.regularPrice);
  const displayPrice = formatPriceValue(product.price);

  const hasDiscount = displaySalePrice && displayRegularPrice && (displaySalePrice !== displayRegularPrice);
  const discountPercent = hasDiscount ? calculateDiscount(displayRegularPrice, displaySalePrice) : null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
        
        <div className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col md:flex-row max-h-[85vh] md:max-h-[450px] transition-all duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            
            <button onClick={onClose} className="absolute top-3 right-3 z-20 p-1.5 bg-white/90 backdrop-blur rounded-full hover:bg-gray-100 transition shadow-sm cursor-pointer border-none outline-none">
                <X className="w-5 h-5 text-gray-500 hover:text-brand-dark" />
            </button>
            
            <div className="w-full md:w-5/12 bg-gray-50 relative min-h-[200px] md:min-h-full">
                <Image 
                    src={product.image?.sourceUrl || product.image || '/placeholder.jpg'} 
                    alt={product.name} 
                    fill 
                    className="object-cover"
                />
                {discountPercent && (
                    <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                        <Tag className="w-3 h-3" /> -{discountPercent}%
                    </div>
                )}
            </div>

            <div className="w-full md:w-7/12 p-5 flex flex-col h-full overflow-hidden text-left">
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <span className="text-[10px] font-bold text-brand-DEFAULT uppercase tracking-wider mb-1 block">
                        {product.productCategories?.nodes?.[0]?.name || tCommon('collection')}
                    </span>
                    
                    <h2 className="text-xl font-black text-brand-dark mb-3 leading-tight font-serif">
                        {product.name}
                    </h2>
                    
                    <div className="mb-4">
                        {hasDiscount ? (
                            <div className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-xl border border-gray-100 w-fit">
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{tProduct('priceLabel')}</span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-black text-red-600">{displaySalePrice}</span>
                                        <span className="text-sm text-gray-400 line-through decoration-red-300 decoration-2 font-medium opacity-70">
                                            {displayRegularPrice}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 w-fit">
                                <span className="text-2xl font-black text-brand-dark">{displayPrice}</span>
                            </div>
                        )}
                    </div>

                    <div className="text-gray-600 text-xs leading-relaxed mb-4 line-clamp-4" dangerouslySetInnerHTML={{ __html: product.shortDescription || product.description || '' }} />
                    
                    {product.attributes?.nodes && (
                        <div className="mb-4">
                            <span className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">{tCatalog('filters.color')}</span>
                            <div className="flex gap-2 flex-wrap">
                                {product.attributes.nodes
                                  .filter((a: any) => ['pa_color', 'color', 'feri'].some(key => a.name.toLowerCase().includes(key)))
                                  .flatMap((a: any) => a.options || [])
                                  .map((opt: string, i: number) => (
                                    <div 
                                        key={i} 
                                        className="w-5 h-5 rounded-full border border-gray-200 shadow-sm cursor-help hover:scale-110 transition-transform" 
                                        style={{ backgroundColor: getColorHex(opt) }} 
                                        title={opt} 
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="pt-3 border-t border-gray-100 mt-auto shrink-0">
                    <button 
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        className={`w-full py-3 rounded-lg font-bold transition active:scale-95 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs uppercase tracking-wide ${
                            isOutOfStock 
                            ? 'bg-gray-100 text-gray-400' 
                            : 'bg-brand-dark text-white hover:bg-brand-DEFAULT'
                        }`}
                    >
                        <ShoppingBag className="w-4 h-4" /> 
                        {isOutOfStock ? tProduct('outOfStock') : tProduct('addToCart')}
                    </button>
                    
                    <Link href={{ pathname: '/product/[slug]', params: { slug: product.slug } }} className="w-full block text-center text-[10px] font-bold text-gray-400 mt-2 hover:text-brand-dark transition uppercase tracking-widest">
                        {tProduct('viewDetails')}
                    </Link>
                </div>
            </div>
        </div>
    </div>
  );
}