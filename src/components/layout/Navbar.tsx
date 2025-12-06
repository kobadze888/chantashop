'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Menu, X, User } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-[#FDFBF7]/90 backdrop-blur-md shadow-sm py-4' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
            
            {/* მენიუ და ძებნა */}
            <div className="flex items-center gap-4 flex-1">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-full hover:bg-mocha-medium/20 text-mocha-dark"
              >
                <Menu className="w-6 h-6" />
              </button>
              <button className="hidden lg:flex p-2 rounded-full hover:bg-mocha-medium/20 text-mocha-dark transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* ლოგო */}
            <div className="flex-1 text-center">
              <Link href="/" className="text-2xl font-black tracking-widest uppercase text-mocha-dark">
                Chanta<span className="text-mocha-DEFAULT">.ge</span>
              </Link>
            </div>

            {/* მარჯვენა მხარე */}
            <div className="flex items-center justify-end gap-2 flex-1 text-mocha-dark">
              <button className="hidden lg:flex p-2 rounded-full hover:bg-mocha-medium/20 transition-colors">
                <User className="w-6 h-6" />
              </button>
              <button className="p-2 rounded-full hover:bg-mocha-medium/20 transition-colors relative">
                <ShoppingBag className="w-6 h-6" />
                <span className="absolute top-1.5 right-1.5 bg-mocha-DEFAULT text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full">
                  0
                </span>
              </button>
            </div>
        </div>
      </header>

      {/* მობილური მენიუ */}
      <div className={`fixed inset-0 z-[60] transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative bg-[#FDFBF7] w-[80%] max-w-[300px] h-full p-8 shadow-2xl flex flex-col border-r border-mocha-medium/50">
            <div className="flex justify-between items-center mb-10">
                <span className="text-xl font-bold text-mocha-dark uppercase tracking-widest">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6 text-mocha-dark" />
                </button>
            </div>
            <nav className="space-y-6 text-lg font-medium text-mocha-dark/80">
               <Link href="/" className="block hover:text-mocha-DEFAULT transition">მთავარი</Link>
               <Link href="/shop" className="block hover:text-mocha-DEFAULT transition">ჩანთები</Link>
               <Link href="/travel" className="block hover:text-mocha-DEFAULT transition">ჩემოდნები</Link>
               <Link href="/accessories" className="block hover:text-mocha-DEFAULT transition">სათვალე</Link>
            </nav>
          </div>
      </div>
    </>
  );
}