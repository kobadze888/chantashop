'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/navigation';
import { ShoppingBag, Search, Menu, X, User, Heart } from 'lucide-react';

export default function Header() {
  const locale = useLocale();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // სქროლის ეფექტისთვის
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            
            {/* მარცხენა მხარე (Mobile Menu & Search) */}
            <div className="flex items-center gap-4 flex-1">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
              >
                <Menu className="w-6 h-6" />
              </button>
              <button className="hidden lg:flex p-2 hover:bg-gray-100 rounded-full">
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* ცენტრი - ლოგო */}
            <div className="flex-1 text-center">
              <Link href="/" className="text-2xl font-black tracking-tighter uppercase">
                Chanta<span className="text-blue-600">Shop</span>
              </Link>
            </div>

            {/* მარჯვენა მხარე - აიქონები */}
            <div className="flex items-center justify-end gap-2 flex-1">
              <div className="hidden lg:flex items-center gap-1 mr-4 text-sm font-bold">
                {['ka', 'en', 'ru'].map((l) => (
                  <Link 
                    key={l} 
                    href={pathname} 
                    locale={l} 
                    className={`px-2 py-1 rounded ${locale === l ? 'bg-black text-white' : 'text-gray-500 hover:text-black'}`}
                  >
                    {l.toUpperCase()}
                  </Link>
                ))}
              </div>

              <button className="p-2 hover:bg-gray-100 rounded-full">
                <User className="w-6 h-6" />
              </button>
              <button className="hidden lg:flex p-2 hover:bg-gray-100 rounded-full">
                <Heart className="w-6 h-6" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full relative">
                <ShoppingBag className="w-6 h-6" />
                <span className="absolute top-1 right-0 bg-blue-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  0
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* მობილური მენიუ (Side Drawer) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60]">
          {/* შავი ფონი */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* თეთრი მენიუ */}
          <div className="absolute top-0 left-0 bottom-0 w-[80%] max-w-[300px] bg-white p-6 shadow-2xl animate-slide-in">
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-bold">მენიუ</span>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="space-y-6 text-lg font-medium">
              <Link href="/" className="block py-2 border-b">მთავარი</Link>
              <Link href="/shop" className="block py-2 border-b">კოლექცია</Link>
              <Link href="/about" className="block py-2 border-b">ჩვენს შესახებ</Link>
              <Link href="/contact" className="block py-2 border-b">კონტაქტი</Link>
            </nav>

            <div className="mt-8">
               <h3 className="text-sm text-gray-400 mb-4 uppercase tracking-wider">ენის შეცვლა</h3>
               <div className="flex gap-4">
                  {['ka', 'en', 'ru'].map((l) => (
                    <Link 
                      key={l} 
                      href={pathname} 
                      locale={l} 
                      className={`px-4 py-2 rounded border ${locale === l ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-200'}`}
                    >
                      {l.toUpperCase()}
                    </Link>
                  ))}
               </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}