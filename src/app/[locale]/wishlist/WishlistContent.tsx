'use client';

import { useWishlistStore } from '@/store/wishlistStore';
import ProductCard from '@/components/products/ProductCard';
import { useTranslations } from 'next-intl';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link } from '@/navigation';
import { useEffect, useState } from 'react';
import QuickView from '@/components/products/QuickView'; 

export default function WishlistContent({ locale }: { locale: string }) {
  const { items } = useWishlistStore();
  const tNav = useTranslations('Navigation');
  const tWish = useTranslations('Wishlist');
  const [mounted, setMounted] = useState(false);
  
  // სწრაფი ნახვის სტეიტი
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6">
        
        {/* სათაურის სექცია */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-gray-100 pb-8">
            <div className="flex items-center gap-4">
                <div className="p-4 bg-red-50 rounded-2xl">
                    <Heart className="w-8 h-8 text-red-500 fill-current" />
                </div>
                <div>
                    <h1 className="text-3xl md:text-4xl font-serif font-black text-brand-dark">
                        {tWish('title')}
                    </h1>
                    <p className="text-gray-400 font-medium">
                        {items.length} {tNav('wishlist')}
                    </p>
                </div>
            </div>

            <Link 
                href="/shop" 
                className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-brand-dark transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                {tNav('shop')}
            </Link>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
            {items.map((item) => (
              <ProductCard
                key={item.id}
                // ✅ გადავცემთ მთლიან item-ს, რომელიც ახლა უკვე შეიცავს attributes, stockStatus და სხვა ველებს
                {...item}
                locale={locale}
                // ✅ onQuickView-ს ვაწვდით სრულ ობიექტს
                onQuickView={() => setSelectedProduct(item)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 flex flex-col items-center justify-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-sm">
                <Heart className="w-10 h-10 text-gray-200" />
            </div>
            <h2 className="text-2xl font-black text-brand-dark mb-3">
                {tWish('empty')}
            </h2>
            <p className="text-gray-400 mb-10 max-w-xs mx-auto">
                {tWish('emptyDescription')}
            </p>
            <Link 
                href="/shop" 
                className="bg-brand-dark text-white px-10 py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-brand-DEFAULT transition-all shadow-xl hover:shadow-brand-DEFAULT/30 active:scale-95 flex items-center gap-2"
            >
                <ShoppingBag className="w-5 h-5" />
                {tWish('goShop')}
            </Link>
          </div>
        )}
      </div>

      {/* სწრაფი ნახვის მოდალი */}
      {selectedProduct && (
        <QuickView 
          product={selectedProduct} 
          isOpen={!!selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
}