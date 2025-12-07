import { Home, Search, ShoppingBag, User } from 'lucide-react';
import Link from 'next/link';

export default function BottomNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-mocha-medium/20 px-6 py-4 pb-6 flex justify-between items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <Link href="/" className="flex flex-col items-center gap-1 text-mocha-DEFAULT">
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-bold">მთავარი</span>
        </Link>
        <div className="flex flex-col items-center gap-1 text-mocha-medium hover:text-mocha-dark transition">
            <Search className="w-6 h-6" />
            <span className="text-[10px] font-medium">ძებნა</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-mocha-medium hover:text-mocha-dark transition relative">
            <ShoppingBag className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold">2</span>
            <span className="text-[10px] font-medium">კალათა</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-mocha-medium hover:text-mocha-dark transition">
            <User className="w-6 h-6" />
            <span className="text-[10px] font-medium">პროფილი</span>
        </div>
    </div>
  );
}