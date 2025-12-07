'use client';

import { Link } from '@/navigation'; // შევცვალეთ next/link -> @/navigation
import { Search, ShoppingBag, Menu, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  // სქროლის ეფექტი: როცა ჩამოწევ, ჰედერი "შუშის" ხდება
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* === DESKTOP HEADER (MD+) === */}
      <header 
        className={`hidden md:flex fixed top-0 left-0 right-0 z-50 px-8 py-5 justify-between items-center transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm py-4 text-mocha-dark' 
            : 'bg-transparent text-white py-6'
        }`}
      >
        <div className="flex items-center gap-12">
          <Link href="/" className="text-2xl font-black tracking-tighter uppercase mix-blend-difference">
            Chanta<span className="text-mocha-DEFAULT">Shop</span>
          </Link>
          <nav className={`flex gap-8 text-sm font-bold tracking-wide ${isScrolled ? 'text-mocha-dark' : 'text-white/90'}`}>
            <Link href="/collection" className="hover:text-mocha-DEFAULT transition duration-300">კოლექცია</Link>
            <Link href="/sale" className="hover:text-mocha-DEFAULT transition duration-300">Sale</Link>
            <Link href="/about" className="hover:text-mocha-DEFAULT transition duration-300">ჩვენს შესახებ</Link>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className={`px-4 py-1.5 rounded-full border text-xs font-bold cursor-pointer hover:bg-white/10 transition ${
             isScrolled ? 'border-mocha-medium text-mocha-dark' : 'bg-white/10 border-white/20 text-white backdrop-blur-md'
          }`}>
            KA | EN
          </div>
          <button className="hover:text-mocha-DEFAULT transition"><Search className="w-5 h-5" /></button>
          <button className="hover:text-mocha-DEFAULT transition"><Heart className="w-5 h-5" /></button>
          <button className="hover:text-mocha-DEFAULT transition relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold">0</span>
          </button>
        </div>
      </header>

      {/* === MOBILE HEADER (< MD) === */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 p-5 flex justify-between items-center transition-all duration-300">
         <button className="glass-panel p-2.5 rounded-full text-mocha-dark active:scale-95 transition">
            <Menu className="w-5 h-5" />
         </button>
         
         <Link href="/" className="font-black text-lg tracking-tighter text-white drop-shadow-md mix-blend-overlay">
            CHANTA.GE
         </Link>
         
         <button className="glass-panel p-2.5 rounded-full relative text-mocha-dark active:scale-95 transition">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
         </button>
      </header>
    </>
  );
}