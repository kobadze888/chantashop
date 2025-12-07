'use client';

import { Link } from '@/navigation';
import { Search, ShoppingBag, Menu, X, ChevronRight, Percent } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = mounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* 1. TOP PROMO BAR (Visible only on Desktop - design2.html) */}
      <div className="hidden md:flex fixed top-0 w-full bg-brand-dark text-white text-[10px] md:text-xs font-bold text-center py-2.5 z-[60] tracking-widest uppercase justify-center items-center gap-2">
          <span>უფასო მიწოდება 200₾+ შეკვეთებზე</span>
      </div>

      {/* 2. MAIN HEADER (Positioned below promo bar on desktop) */}
      <header 
        className="fixed w-full top-0 md:top-8 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100/50 transition-all duration-300 shadow-sm"
        id="navbar"
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            
            {/* Mobile Menu Toggle */}
            <button 
                onClick={() => setIsMobileMenuOpen(true)} 
                className="md:hidden p-2 text-brand-dark hover:bg-gray-100 rounded-full transition"
            >
                <Menu className="w-7 h-7" />
            </button>

            {/* Logo */}
            <Link href="/" className="cursor-pointer flex items-center gap-2 select-none group">
                <span className="font-serif text-2xl font-black tracking-tighter italic text-brand-dark">
                    Chanta<span className="text-brand-DEFAULT not-italic font-sans">Shop</span>.
                </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex gap-10 text-sm font-bold tracking-widest text-brand-dark uppercase">
                <Link href="/collection" className="hover:text-brand-DEFAULT transition-colors py-2 relative group">
                    კოლექცია<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-DEFAULT transition-all group-hover:w-full"></span>
                </Link>
                <Link href="/brands" className="hover:text-brand-DEFAULT transition-colors py-2 relative group">
                    ბრენდები<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-DEFAULT transition-all group-hover:w-full"></span>
                </Link>
                <Link href="#" className="hover:text-brand-DEFAULT transition-colors py-2 relative group">
                    აქსესუარები<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-DEFAULT transition-all group-hover:w-full"></span>
                </Link>
                <Link href="/sale" className="text-brand-DEFAULT hover:text-pink-700 transition-colors py-2 font-black">
                    SALE
                </Link>
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-3">
                <button className="hidden md:flex p-3 hover:bg-gray-100 rounded-full transition group">
                    <Search className="w-5 h-5 text-gray-600 group-hover:text-brand-dark" />
                </button>
                
                <Link href="/cart" className="relative p-3 bg-brand-dark text-white rounded-full transition hover:bg-brand-DEFAULT group shadow-lg hover:shadow-brand-DEFAULT/30">
                    <div className="relative">
                        <ShoppingBag className="w-5 h-5" />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-600 border-2 border-white text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full font-bold">
                                {cartCount}
                            </span>
                        )}
                    </div>
                </Link>
            </div>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY */}
      <div 
        className={`fixed inset-0 bg-white z-[100] transform transition-transform duration-300 flex flex-col h-screen ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white shadow-sm shrink-0">
             <span className="font-serif text-2xl font-black tracking-tighter italic text-brand-dark">
                Chanta<span className="text-brand-DEFAULT not-italic font-sans">Shop</span>.
            </span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-brand-light transition">
                <X className="w-6 h-6 text-brand-dark" />
            </button>
        </div>
        
        <div className="flex flex-col p-6 gap-2 overflow-y-auto h-full bg-white pb-32">
            <nav className="flex flex-col gap-4 text-xl font-bold text-brand-dark">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="p-5 bg-gray-50 rounded-2xl active:bg-brand-DEFAULT active:text-white transition flex justify-between items-center shadow-sm">
                    მთავარი <ChevronRight className="w-5 h-5 opacity-50" />
                </Link>
                <Link href="/collection" onClick={() => setIsMobileMenuOpen(false)} className="p-5 bg-gray-50 rounded-2xl active:bg-brand-DEFAULT active:text-white transition flex justify-between items-center shadow-sm">
                    კოლექცია <ChevronRight className="w-5 h-5 opacity-50" />
                </Link>
                <Link href="/brands" onClick={() => setIsMobileMenuOpen(false)} className="p-5 bg-gray-50 rounded-2xl active:bg-brand-DEFAULT active:text-white transition flex justify-between items-center shadow-sm">
                    ბრენდები <ChevronRight className="w-5 h-5 opacity-50" />
                </Link>
                <Link href="/sale" onClick={() => setIsMobileMenuOpen(false)} className="p-5 border-2 border-brand-DEFAULT text-brand-DEFAULT rounded-2xl active:bg-brand-DEFAULT active:text-white transition flex justify-between items-center mt-4 shadow-sm">
                    ფასდაკლება <Percent className="w-5 h-5" />
                </Link>
            </nav>
        </div>
      </div>
    </>
  );
}