'use client';

import Link from 'next/link';
import { Search, ShoppingBag, User, Menu } from 'lucide-react';

export default function Header() {
  return (
    <>
      {/* Desktop Header - Absolute & Transparent */}
      <header className="absolute top-0 left-0 right-0 z-50 px-6 py-6 hidden md:flex justify-between items-center text-white">
        <div className="flex items-center gap-12">
          <Link href="/" className="text-2xl font-black tracking-tighter uppercase text-mocha-dark mix-blend-difference">
            Chanta<span className="text-mocha-DEFAULT">Shop</span>
          </Link>
          <nav className="flex gap-8 text-sm font-bold text-white/90">
            <Link href="/collection" className="hover:text-mocha-DEFAULT transition duration-300">კოლექცია</Link>
            <Link href="/sale" className="hover:text-mocha-DEFAULT transition duration-300">Sale</Link>
            <Link href="/about" className="hover:text-mocha-DEFAULT transition duration-300">ჩვენს შესახებ</Link>
          </nav>
        </div>

        <div className="flex items-center gap-5 text-white">
          <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-xs font-bold cursor-pointer hover:bg-white/20 transition">
            KA | EN
          </div>
          <Search className="w-6 h-6 cursor-pointer hover:text-mocha-DEFAULT transition" />
          <ShoppingBag className="w-6 h-6 cursor-pointer hover:text-mocha-DEFAULT transition" />
        </div>
      </header>

      {/* Mobile Header (Simple Logo) */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 p-5 flex justify-between items-center bg-transparent">
         <div className="glass-panel p-2.5 rounded-full">
            <Menu className="w-5 h-5 text-mocha-dark" />
         </div>
         <div className="font-black text-lg tracking-tighter text-mocha-dark drop-shadow-sm">CHANTA.GE</div>
         <div className="glass-panel p-2.5 rounded-full relative">
            <ShoppingBag className="w-5 h-5 text-mocha-dark" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
         </div>
      </header>
    </>
  );
}