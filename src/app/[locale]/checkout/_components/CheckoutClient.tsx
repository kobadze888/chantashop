// src/app/[locale]/checkout/_components/CheckoutClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import { Link } from '@/navigation';

export default function CheckoutClient({ locale }: { locale: string }) {
  const { items, totalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-bold mb-4">კალათა ცარიელია</h2>
        <Link href="/collection" className="text-brand-DEFAULT hover:underline font-bold">
          კატალოგში დაბრუნება
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* მარცხენა: ფორმა */}
      <div className="space-y-6">
        <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
          <h3 className="font-bold text-xl mb-6 text-brand-dark uppercase tracking-wide">საკონტაქტო ინფორმაცია</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">სახელი, გვარი</label>
              <input type="text" className="w-full border border-gray-200 p-4 rounded-xl focus:outline-none focus:border-brand-DEFAULT transition" placeholder="თქვენი სახელი" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">ტელეფონი</label>
              <input type="tel" className="w-full border border-gray-200 p-4 rounded-xl focus:outline-none focus:border-brand-DEFAULT transition" placeholder="+995 5XX XX XX XX" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">მისამართი</label>
              <textarea className="w-full border border-gray-200 p-4 rounded-xl focus:outline-none focus:border-brand-DEFAULT transition h-32 resize-none" placeholder="ქალაქი, ქუჩა, ბინა..."></textarea>
            </div>
          </div>
        </div>
        <button className="w-full bg-brand-dark text-white py-5 rounded-xl font-bold hover:bg-brand-DEFAULT transition shadow-xl text-lg uppercase tracking-widest active:scale-95 duration-200">
          შეკვეთის დადასტურება
        </button>
      </div>

      {/* მარჯვენა: შეჯამება */}
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl h-fit sticky top-32">
        <h3 className="font-bold text-xl mb-6 text-brand-dark uppercase tracking-wide">თქვენი შეკვეთა</h3>
        <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {items.map((item) => (
            <div key={`${item.id}-${JSON.stringify(item.selectedOptions)}`} className="flex gap-4 items-start">
              <div className="relative w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-brand-dark line-clamp-2 leading-relaxed">{item.name}</h4>
                <div className="text-xs text-gray-500 mt-1 space-y-1">
                    <p>რაოდენობა: <span className="font-bold text-brand-dark">{item.quantity}</span></p>
                    {item.selectedOptions && Object.values(item.selectedOptions).join(', ')}
                </div>
              </div>
              <div className="font-bold text-sm whitespace-nowrap">{item.price}</div>
            </div>
          ))}
        </div>
        
        <div className="border-t border-dashed border-gray-200 pt-6">
          <div className="flex justify-between items-end">
            <span className="font-bold text-gray-500">სულ გადასახდელი:</span>
            <span className="font-black text-3xl text-brand-DEFAULT">{totalPrice().toFixed(2)} ₾</span>
          </div>
        </div>
      </div>
    </div>
  );
}