'use client';
import { Home, Search, ShoppingBag, User } from 'lucide-react';
import { Link } from '@/navigation';
import { useCartStore } from '@/store/cartStore';
import { useEffect, useState } from 'react';

export default function BottomNav() {
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = mounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;

  return (
    // შეცვლილია: bottom-0, left-0, right-0, rounded-t-2xl (მხოლოდ ზემოთ მომრგვალებული)
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl text-brand-dark rounded-t-[1.5rem] px-6 py-4 flex justify-between items-center z-50 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] border-t border-gray-100">
        <Link href="/" className="flex flex-col items-center gap-1 text-brand-DEFAULT transition active:scale-95">
            <Home className="w-6 h-6" />
        </Link>
        <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-brand-dark transition active:scale-95">
            <Search className="w-6 h-6" />
        </button>
        <Link href="/cart" className="flex flex-col items-center gap-1 text-gray-400 hover:text-brand-dark transition active:scale-95 relative group">
            <div className="relative">
                <ShoppingBag className="w-6 h-6" />
                <span className={`absolute -top-2 -right-2 bg-brand-DEFAULT text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold transition-opacity ${cartCount > 0 ? 'opacity-100' : 'opacity-0'}`}>
                    {cartCount}
                </span>
            </div>
        </Link>
        <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-brand-dark transition active:scale-95">
            <User className="w-6 h-6" />
        </button>
    </div>
  );
}