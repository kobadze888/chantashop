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
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">კალათა ცარიელია</h2>
        <Link href="/" className="text-brand-DEFAULT hover:underline">
          მთავარზე დაბრუნება
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* ფორმა */}
      <div className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <h3 className="font-bold text-xl mb-4 text-brand-dark">საკონტაქტო ინფორმაცია</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">სახელი, გვარი</label>
              <input type="text" className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-brand-DEFAULT transition" placeholder="შეიყვანეთ სახელი" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">ტელეფონი</label>
              <input type="tel" className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-brand-DEFAULT transition" placeholder="+995 5XX XX XX XX" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">მისამართი</label>
              <textarea className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-brand-DEFAULT transition h-24" placeholder="ქალაქი, ქუჩა, ბინა..."></textarea>
            </div>
          </div>
        </div>

        <button className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold hover:bg-brand-DEFAULT transition shadow-lg text-lg uppercase tracking-widest">
          შეკვეთის დადასტურება
        </button>
      </div>

      {/* შეკვეთის შეჯამება */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg h-fit">
        <h3 className="font-bold text-xl mb-6 text-brand-dark">თქვენი შეკვეთა</h3>
        <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
          {items.map((item) => (
            <div key={`${item.id}-${JSON.stringify(item.selectedOptions)}`} className="flex gap-4 items-center">
              <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-brand-dark line-clamp-1">{item.name}</h4>
                <p className="text-xs text-gray-500">რაოდენობა: {item.quantity}</p>
              </div>
              <div className="font-bold text-sm">{item.price}</div>
            </div>
          ))}
        </div>
        
        <div className="border-t border-dashed border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">სულ:</span>
            <span className="font-black text-2xl text-brand-DEFAULT">{totalPrice().toFixed(2)} ₾</span>
          </div>
        </div>
      </div>
    </div>
  );
}