'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag, Truck } from 'lucide-react';
import { Link } from '@/navigation';
import { useCartStore } from '@/store/cartStore';
import { useTranslations } from 'next-intl';

const FREE_SHIPPING_THRESHOLD = 200;

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ka-GE', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price) + ' ₾';
};

export default function CartContent() {
  const t = useTranslations('Cart');
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTotal = totalPrice();
  const progress = Math.min((currentTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShip = FREE_SHIPPING_THRESHOLD - currentTotal;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center animate-fade-in">
        <div className="bg-brand-light p-8 rounded-full mb-8 shadow-sm">
          <ShoppingBag className="w-16 h-16 text-brand-DEFAULT opacity-80" />
        </div>
        <h2 className="text-3xl font-serif font-black text-brand-dark mb-4">
          {t('empty')}
        </h2>
        <p className="text-gray-500 mb-10 text-lg max-w-md mx-auto">
          {t('emptyDesc')}
        </p>
        {/* ✅ შეცვლილია /shop-ზე */}
        <Link href="/shop" className="bg-brand-dark text-white px-10 py-4 rounded-full font-bold hover:bg-brand-DEFAULT transition-all shadow-xl hover:shadow-brand-DEFAULT/30 active:scale-95 flex items-center gap-2">
          {t('viewCollection')} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* ... კალათის დანარჩენი კოდი იგივეა ... */}
      <h1 className="text-4xl md:text-5xl font-serif font-black text-brand-dark mb-10">
        {t('title')} 
        <span className="text-xl md:text-2xl text-gray-400 font-sans ml-4 font-normal">
            ({items.reduce((acc, item) => acc + item.quantity, 0)} {items.length === 1 ? t('item') : t('items')})
        </span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-brand-light/30 border border-brand-light p-6 rounded-3xl">
            <div className="flex items-center gap-3 mb-3 text-brand-dark font-bold text-sm uppercase tracking-wider">
               <Truck className="w-5 h-5 text-brand-DEFAULT" />
               {remainingForFreeShip > 0 
                 ? t('freeShippingAdd', { amount: formatPrice(remainingForFreeShip) })
                 : t('freeShippingDone')
               }
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-brand-DEFAULT transition-all duration-1000 ease-out rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <div className="space-y-6">
            {items.map((item) => (
              <div key={`${item.id}-${JSON.stringify(item.selectedOptions)}`} className="group bg-white p-4 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex gap-6 items-center">
                <Link href={{ pathname: '/product/[slug]', params: { slug: item.slug } }} className="relative w-28 h-32 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                  <Image src={item.image || '/placeholder.jpg'} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </Link>
                <div className="flex-1 flex flex-col justify-between py-1 h-full">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Link href={{ pathname: '/product/[slug]', params: { slug: item.slug } }} className="font-bold text-brand-dark text-lg md:text-xl hover:text-brand-DEFAULT transition line-clamp-1 font-serif">
                        {item.name}
                      </Link>
                      {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {Object.entries(item.selectedOptions).map(([key, value]) => (
                            <span key={key} className="text-[10px] uppercase font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{value}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition p-2 hover:bg-red-50 rounded-full"><Trash2 className="w-5 h-5" /></button>
                  </div>
                  <div className="flex justify-between items-end mt-4">
                    <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 h-10 shadow-inner">
                      <button onClick={() => updateQuantity(item.id, 'dec')} className="w-10 h-full flex items-center justify-center hover:text-brand-DEFAULT transition active:scale-90" disabled={item.quantity <= 1}><Minus className="w-3 h-3" /></button>
                      <span className="w-6 text-center font-bold text-sm text-brand-dark">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 'inc')} 
                        disabled={item.quantity >= (item.stockQuantity || Infinity)}
                        className="w-10 h-full flex items-center justify-center hover:text-brand-DEFAULT transition active:scale-90 disabled:opacity-50"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-black text-brand-dark text-xl font-serif">{formatPrice(parseFloat(item.price.replace(/[^0-9.]/g, '')))}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1 lg:sticky lg:top-32">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-light/50 rounded-full blur-3xl -z-10 translate-x-10 -translate-y-10"></div>
            <h3 className="text-2xl font-serif font-bold text-brand-dark mb-8">{t('title')}</h3>
            <div className="space-y-4 text-sm text-gray-600 mb-8">
              <div className="flex justify-between items-center">
                <span>{t('subtotal')}</span>
                <span className="font-bold text-base">{formatPrice(currentTotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>{t('shipping')}</span>
                {remainingForFreeShip <= 0 ? <span className="text-green-600 font-bold uppercase text-xs bg-green-50 px-2 py-1 rounded">{t('free')}</span> : <span className="text-gray-400 text-xs">{t('calcNext')}</span>}
              </div>
            </div>
            <div className="border-t border-dashed border-gray-200 pt-6 mb-8">
              <div className="flex justify-between items-end">
                <span className="font-bold text-brand-dark text-lg">{t('total')}</span>
                <span className="block text-3xl font-black text-brand-DEFAULT font-serif leading-none">{formatPrice(currentTotal)}</span>
              </div>
            </div>
            <Link href="/checkout" className="w-full bg-brand-dark text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-brand-DEFAULT transition-all transform hover:-translate-y-1 shadow-lg shadow-brand-dark/20 group active:scale-95 uppercase tracking-widest text-xs">
              {t('checkout')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}