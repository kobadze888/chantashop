'use client';

import { X, ShoppingBag } from 'lucide-react';
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
  'shavi': '#000000', 'black': '#000000',
  'tetri': '#FFFFFF', 'white': '#FFFFFF',
  'lurji': '#2563EB', 'blue': '#2563EB',
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

export default function QuickView({ product, isOpen, onClose }: QuickViewProps) {
  const addItem = useCartStore((state) => state.addItem);
  const tProduct = useTranslations('Product');
  const tCatalog = useTranslations('Catalog');

  if (!product) return null;

  const handleAddToCart = () => {
    addItem({
      id: product.databaseId || product.id,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.image?.sourceUrl || product.image,
      slug: product.slug,
      stockQuantity: product.stockQuantity
    });
    onClose();
  };

  const isOutOfStock = product.stockQuantity === 0 || product.stockStatus !== 'IN_STOCK';

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
        <div className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[600px] transition-all duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-brand-light transition shadow-sm cursor-pointer">
                <X className="w-6 h-6 text-brand-dark" />
            </button>
            <div className="w-full md:w-1/2 bg-gray-50 relative min-h-[300px]">
                <Image src={product.image?.sourceUrl || product.image || '/placeholder.jpg'} alt={product.name} fill className="object-cover"/>
            </div>
            <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">
                <div className="mb-auto">
                    <span className="text-xs font-bold text-brand-DEFAULT uppercase tracking-wider mb-2 block">
                        {product.productCategories?.nodes?.[0]?.name || 'Collection'}
                    </span>
                    <h2 className="text-3xl font-black text-brand-dark mb-2 leading-tight font-serif">{product.name}</h2>
                    <p className="text-2xl font-black text-brand-dark mb-4">{product.salePrice || product.price}</p>
                    <div className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-4" dangerouslySetInnerHTML={{ __html: product.shortDescription || product.description || '' }} />
                    
                    {/* Colors Section */}
                    {product.attributes?.nodes && (
                        <div className="mb-6">
                            <span className="text-xs font-bold text-brand-dark uppercase mb-2 block">{tCatalog('filters.color')}</span>
                            <div className="flex gap-3">
                                {product.attributes.nodes
                                  .filter((a: any) => ['pa_color', 'color', 'feri'].some(key => a.name.toLowerCase().includes(key)))
                                  .flatMap((a: any) => a.options || [])
                                  .map((opt: string, i: number) => (
                                    <div key={i} className="w-8 h-8 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: colorMap[opt.toLowerCase()] || '#eee' }} title={opt} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="pt-6 border-t border-gray-100 mt-6">
                    <button 
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold hover:bg-brand-DEFAULT transition active:scale-95 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        <ShoppingBag className="w-5 h-5" /> 
                        {isOutOfStock ? tProduct('outOfStock') : tProduct('addToCart')}
                    </button>
                    <Link href={{ pathname: '/product/[slug]', params: { slug: product.slug } }} className="w-full block text-center text-xs font-bold text-brand-dark mt-4 hover:underline uppercase tracking-wide">
                        მთლიანი პროდუქტის ნახვა
                    </Link>
                </div>
            </div>
        </div>
    </div>
  );
}