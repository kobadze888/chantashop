// ფაილის გზა: src/components/Header.tsx

'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/navigation';
import { ShoppingBag, Search, Menu, X, User, Heart } from 'lucide-react';
import MenuDynamic from './MenuDynamic';

export default function Header() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('Header');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logoText = 'Chanta';
  const logoSuffix = '.ge';

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3 border-b border-mocha-medium/30' : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            
            {/* Left Side (Menu & Search) */}
            <div className="flex items-center gap-4 flex-1">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-mocha-medium/20 rounded-full text-mocha-dark"
              >
                <Menu className="w-6 h-6" />
              </button>
              <button className="hidden lg:flex p-2 hover:bg-mocha-medium/20 rounded-full text-mocha-dark">
                <Search className="w-5 h-5" />
              </button>

              {/* Desktop Nav Links (Dynamic Menu) */}
              <nav className="hidden lg:flex gap-8 text-sm font-bold text-mocha-dark/80 ml-8">
                <MenuDynamic location="PRIMARY_MENU" />
              </nav>
            </div>

            {/* Center - Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-black tracking-tighter uppercase text-mocha-dark">
                {logoText}<span className="text-mocha-DEFAULT">{logoSuffix}</span>
              </Link>
            </div>

            {/* Right Side - Icons and Language */}
            <div className="flex items-center justify-end gap-2 flex-1 text-mocha-dark">
              <div className="hidden lg:flex items-center gap-1 mr-4 text-sm font-bold">
                {['ka', 'en', 'ru'].map((l) => (
                  <Link 
                    key={l} 
                    href={pathname} 
                    locale={l} 
                    className={`px-2 py-1 rounded-full text-xs transition-colors ${locale === l ? 'bg-mocha-DEFAULT text-white' : 'text-mocha-dark/60 hover:text-mocha-dark hover:bg-mocha-medium/20'}`}
                  >
                    {l.toUpperCase()}
                  </Link>
                ))}
              </div>

              <button className="hidden lg:flex p-2 hover:bg-mocha-medium/20 rounded-full">
                <Heart className="w-6 h-6" />
              </button>
              <button className="p-2 hover:bg-mocha-medium/20 rounded-full">
                <User className="w-6 h-6" />
              </button>
              <button className="p-2 hover:bg-mocha-medium/20 rounded-full relative">
                <ShoppingBag className="w-6 h-6" />
                <span className="absolute top-1 right-0 bg-mocha-DEFAULT text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  0
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu (Side Drawer) */}
      <div className={`fixed inset-0 z-[60] transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          
          {/* Panel */}
          <div className="relative bg-mocha-light w-[80%] max-w-[300px] h-full p-8 shadow-2xl flex flex-col border-r border-mocha-medium/50">
            <div className="flex justify-between items-center mb-10">
                <span className="text-xl font-bold text-mocha-dark uppercase tracking-widest">{t('menu')}</span>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6 text-mocha-dark" />
                </button>
            </div>
            
            <nav className="space-y-6 text-lg font-medium text-mocha-dark">
              <MenuDynamic location="MOBILE_MENU" mobileClose={() => setIsMobileMenuOpen(false)} />
            </nav>
            
            <div className="mt-auto pt-8 border-t border-mocha-medium/50">
                <p className="text-xs text-mocha-DEFAULT font-bold uppercase mb-4">{t('language_switch')}</p>
                <div className="flex gap-3">
                    {['ka', 'en', 'ru'].map((l) => (
                      <Link 
                        key={l} 
                        href={pathname} 
                        locale={l} 
                        className={`text-sm font-bold px-3 py-1 rounded-full transition ${locale === l ? 'bg-mocha-DEFAULT text-white' : 'text-mocha-dark/60 hover:text-mocha-dark border border-mocha-medium/50'}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {l.toUpperCase()}
                      </Link>
                    ))}
                </div>
            </div>
          </div>
      </div>
    </>
  );
}