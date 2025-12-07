// src/app/[locale]/cart/_components/CartContent.tsx

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from '@/navigation';
import { useCartStore } from '@/store/cartStore';

export default function CartContent() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  // Hydration-ის პრობლემის თავიდან აცილება
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="bg-mocha-medium/20 p-6 rounded-full mb-6">
          <ShoppingBag className="w-12 h-12 text-mocha-dark opacity-50" />
        </div>
        <h2 className="text-2xl font-bold text-mocha-dark mb-2">თქვენი კალათა ცარიელია</h2>
        <p className="text-gray-500 mb-8">როგორც ჩანს, ჯერ არაფერი აგირჩევიათ.</p>
        <Link 
          href="/" 
          className="bg-mocha-DEFAULT text-white px-8 py-3 rounded-full font-bold hover:bg-mocha-dark transition shadow-lg active:scale-95"
        >
          საყიდლებზე დაბრუნება
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
      
      {/* მარცხენა მხარე: პროდუქტების სია */}
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-3xl font-black text-mocha-dark mb-6">კალათა ({items.length})</h1>
        
        {items.map((item) => (
          <div key={`${item.id}-${JSON.stringify(item.selectedOptions)}`} className="bg-white p-4 rounded-2xl border border-mocha-medium/20 shadow-sm flex gap-4 transition hover:shadow-md">
            
            {/* სურათი */}
            <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-mocha-light">
              <Image 
                src={item.image || '/placeholder.jpg'} 
                alt={item.name} 
                fill 
                className="object-cover" 
              />
            </div>

            {/* ინფორმაცია */}
            <div className="flex-1 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <Link href={`/product/${item.slug}`} className="font-bold text-mocha-dark text-lg hover:text-mocha-DEFAULT transition line-clamp-1">
                    {item.name}
                  </Link>
                  {/* ვარიაციების ჩვენება (თუ აქვს) */}
                  {item.selectedOptions && (
                    <div className="text-xs text-gray-500 mt-1 flex gap-2">
                      {Object.entries(item.selectedOptions).map(([key, value]) => (
                        <span key={key} className="bg-gray-100 px-2 py-0.5 rounded capitalize">
                          {value}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-red-500 transition p-1"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex justify-between items-end mt-4">
                {/* რაოდენობის კონტროლი */}
                <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                  <button 
                    onClick={() => updateQuantity(item.id, 'dec')}
                    className="p-2 hover:text-mocha-DEFAULT transition active:scale-75"
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-bold text-sm text-mocha-dark">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 'inc')}
                    className="p-2 hover:text-mocha-DEFAULT transition active:scale-75"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* ფასი */}
                <div className="font-black text-mocha-DEFAULT text-lg">
                  {item.price}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* მარჯვენა მხარე: შეჯამება */}
      <div className="lg:col-span-1 lg:sticky lg:top-32">
        <div className="bg-white p-6 rounded-2xl border border-mocha-medium/20 shadow-lg">
          <h3 className="text-xl font-bold text-mocha-dark mb-6">შეჯამება</h3>
          
          <div className="space-y-4 text-sm text-gray-600 mb-6">
            <div className="flex justify-between">
              <span>შუალედური ჯამი</span>
              <span className="font-bold">{totalPrice().toFixed(2)} ₾</span>
            </div>
            <div className="flex justify-between">
              <span>მიწოდება</span>
              <span className="text-green-600 font-bold">უფასო</span>
            </div>
          </div>

          <div className="border-t border-dashed border-mocha-medium/50 pt-4 mb-8">
            <div className="flex justify-between items-center">
              <span className="font-black text-mocha-dark text-lg">სულ გადასახდელი</span>
              <span className="font-black text-mocha-DEFAULT text-2xl">{totalPrice().toFixed(2)} ₾</span>
            </div>
          </div>

          <button className="w-full bg-mocha-dark text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-mocha-DEFAULT transition transform active:scale-95 shadow-lg group">
            შეკვეთის გაფორმება
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-xs text-center text-gray-400 mt-4">
            გადახდა დაცულია SSL სერტიფიკატით
          </p>
        </div>
      </div>

    </div>
  );
}