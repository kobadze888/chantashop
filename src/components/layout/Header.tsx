'use client';

import { Link, usePathname, useRouter } from '@/navigation';
import { useParams } from 'next/navigation';
import { Search, ShoppingBag, Menu, X, ChevronRight, Percent, ChevronDown } from 'lucide-react';
import { useState, useEffect, useTransition, useRef } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useLocale, useTranslations } from 'next-intl';

// ... (SVG FLAGS რჩება იგივე, არ ვცვლით) ...
const FlagGE = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 16" className={className} aria-label="GE"><defs><clipPath id="clip0_ge"><rect width="21" height="16" rx="1" fill="white"></rect></clipPath></defs><g clipPath="url(#clip0_ge)"><rect width="21" height="16" fill="white"></rect><rect x="8.92578" width="3.15" height="16" fill="#FF0000"></rect><rect y="6.4" width="21" height="3.2" fill="#FF0000"></rect><path fill="#FF0000" fillRule="evenodd" d="M4.81648 12.4367C4.8493 11.8767 4.94773 11.4 4.94773 11.4C4.94773 11.4 4.62617 11.4333 4.46211 11.4333C4.29805 11.4333 3.97648 11.4 3.97648 11.4C3.97648 11.4 4.07492 11.8767 4.10773 12.44C3.5532 12.4067 3.08398 12.3067 3.08398 12.3067C3.08398 12.3067 3.1168 12.5533 3.1168 12.8C3.1168 13.0467 3.08398 13.2933 3.08398 13.2933C3.08398 13.2933 3.5532 13.1933 4.10773 13.16C4.07492 13.7233 3.97648 14.2 3.97648 14.2C3.97648 14.2 4.2193 14.1667 4.46211 14.1667C4.70492 14.1667 4.94773 14.2 4.94773 14.2C4.94773 14.2 4.8493 13.7233 4.81648 13.16C5.37102 13.1933 5.84023 13.2933 5.84023 13.2933C5.84023 13.2933 5.80742 12.9667 5.80742 12.8C5.80742 12.6333 5.84023 12.3067 5.84023 12.3067C5.84023 12.3067 5.37102 12.4067 4.81977 12.44L4.81648 12.4367Z"></path><path fill="#FF0000" fillRule="evenodd" d="M16.8915 2.83665C16.9243 2.27665 17.0227 1.79999 17.0227 1.79999C17.0227 1.79999 16.7012 1.83332 16.5371 1.83332C16.373 1.83332 16.0515 1.79999 16.0515 1.79999C16.0515 1.79999 16.1499 2.27665 16.1827 2.83665C15.6282 2.80332 15.159 2.70665 15.159 2.70665C15.159 2.70665 15.1918 2.95332 15.1918 3.19999C15.1918 3.44665 15.159 3.69332 15.159 3.69332C15.159 3.69332 15.6282 3.59332 16.1827 3.55999C16.1499 4.12332 16.0515 4.59999 16.0515 4.59999C16.0515 4.59999 16.2943 4.56665 16.5371 4.56665C16.7799 4.56665 17.0227 4.59999 17.0227 4.59999C17.0227 4.59999 16.9243 4.12332 16.8915 3.56332C17.446 3.59665 17.9152 3.69665 17.9152 3.69665C17.9152 3.69665 17.8824 3.36332 17.8824 3.19999C17.8824 3.03665 17.9152 2.70665 17.9152 2.70665C17.9152 2.70665 17.446 2.80665 16.8915 2.83999V2.83665Z"></path><path fill="#FF0000" fillRule="evenodd" d="M4.81648 2.83665C4.8493 2.27665 4.94773 1.79999 4.94773 1.79999C4.94773 1.79999 4.62617 1.83332 4.46211 1.83332C4.29805 1.83332 3.97648 1.79999 3.97648 1.79999C3.97648 1.79999 4.07492 2.27665 4.10773 2.83999C3.5532 2.80665 3.08398 2.70665 3.08398 2.70665C3.08398 2.70665 3.1168 2.95332 3.1168 3.19999C3.1168 3.44665 3.08398 3.69332 3.08398 3.69332C3.08398 3.69332 3.5532 3.59332 4.10773 3.55999C4.07492 4.12332 3.97648 4.59999 3.97648 4.59999C3.97648 4.59999 4.2193 4.56665 4.46211 4.56665C4.70492 4.56665 4.94773 4.59999 4.94773 4.59999C4.94773 4.59999 4.8493 4.12332 4.81648 3.55999C5.37102 3.59332 5.84023 3.69332 5.84023 3.69332C5.84023 3.69332 5.80742 3.36665 5.80742 3.19999C5.80742 3.03332 5.84023 2.70665 5.84023 2.70665C5.84023 2.70665 5.37102 2.80665 4.81977 2.83999L4.81648 2.83665Z"></path><path fill="#FF0000" fillRule="evenodd" d="M16.8915 12.4367C16.9243 11.8767 17.0227 11.4 17.0227 11.4C17.0227 11.4 16.7012 11.4333 16.5371 11.4333C16.373 11.4333 16.0515 11.4 16.0515 11.4C16.0515 11.4 16.1499 11.8767 16.1827 12.44C15.6282 12.4067 15.159 12.3067 15.159 12.3067C15.159 12.3067 15.1918 12.5533 15.1918 12.8C15.1918 13.0467 15.159 13.2933 15.159 13.2933C15.159 13.2933 15.6282 13.1933 16.1827 13.16C16.1499 13.7233 16.0515 14.2 16.0515 14.2C16.0515 14.2 16.2943 14.1667 16.5371 14.1667C16.7799 14.1667 17.0227 14.2 17.0227 14.2C17.0227 14.2 16.9243 13.7233 16.8915 13.16C17.446 13.1933 17.9152 13.2933 17.9152 13.2933C17.9152 13.2933 17.8824 12.9667 17.8824 12.8C17.8824 12.6333 17.9152 12.3067 17.9152 12.3067C17.9152 12.3067 17.446 12.4067 16.8915 12.44V12.4367Z"></path></g></svg>);
const FlagEN = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 16" className={className} aria-label="EN"><g clipPath="url(#clip0_uk)"><path d="M0 0H21V16H0V0Z" fill="#012169"></path><path d="M2.46094 0L10.4672 6.03333L18.4406 0H21V2.06667L13.125 8.03333L21 13.9667V16H18.375L10.5 10.0333L2.65781 16H0V14L7.84219 8.06667L0 2.13333V0H2.46094Z" fill="white"></path><path d="M13.9125 9.36667L21 14.6667V16L12.1078 9.36667H13.9125ZM7.875 10.0333L8.07187 11.2L1.77187 16H0L7.875 10.0333ZM21 0V0.1L12.8297 6.36667L12.8953 4.9L19.3594 0H21ZM0 0L7.84219 5.86667H5.87344L0 1.4V0Z" fill="#C8102E"></path><path d="M7.90781 0V16H13.1578V0H7.90781ZM0 5.33333V10.6667H21V5.33333H0Z" fill="white"></path><path d="M0 6.43333V9.63333H21V6.43333H0ZM8.95781 0V16H12.1078V0H8.95781Z" fill="#C8102E"></path></g><defs><clipPath id="clip0_uk"><rect width="21" height="16" rx="1" fill="white"></rect></clipPath></defs></svg>);
const FlagRU = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 16" className={className} preserveAspectRatio="none"><g clipPath="url(#clip0_ru)"><path fill="#fff" d="M0 0h21v16H0z"/><path fill="#0039a6" d="M0 5.333h21v10.667H0z"/><path fill="#d52b1e" d="M0 10.667h21v5.333H0z"/></g><defs><clipPath id="clip0_ru"><rect width="21" height="16" rx="1" fill="white"></rect></clipPath></defs></svg>);

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const items = useCartStore((state) => state.items);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('Common');
  const tHeader = useTranslations('Header');

  useEffect(() => {
    setMounted(true);
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cartCount = mounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
  }, [isMobileMenuOpen]);

  const handleLanguageChange = (nextLocale: string) => {
    startTransition(() => {
      // @ts-expect-error
      router.replace({ pathname, params }, { locale: nextLocale });
      setIsLangMenuOpen(false);
      setIsMobileMenuOpen(false);
    });
  };

  const languages = [
    { code: 'ka', label: 'GE', Flag: FlagGE },
    { code: 'en', label: 'EN', Flag: FlagEN },
    { code: 'ru', label: 'RU', Flag: FlagRU },
  ];

  const CurrentFlag = languages.find(l => l.code === locale)?.Flag || FlagGE;
  const currentLabel = languages.find(l => l.code === locale)?.label || 'GE';
  const availableLanguages = languages.filter(lang => lang.code !== locale);

  return (
    <>
      <div className="hidden md:flex fixed top-0 w-full bg-brand-dark text-white text-[10px] md:text-xs font-bold text-center py-2.5 z-[60] tracking-widest uppercase justify-center items-center gap-2">
          <span>{tHeader('promo')}</span>
      </div>

      <header 
        className="fixed w-full top-0 md:top-8 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100/50 transition-all duration-300 shadow-sm"
        id="navbar"
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-brand-dark hover:bg-gray-100 rounded-full transition">
                <Menu className="w-7 h-7" />
            </button>

            <Link href="/" className="cursor-pointer flex items-center gap-2 select-none group">
                <span className="font-serif text-2xl font-black tracking-tighter italic text-brand-dark">
                    Chanta<span className="text-brand-DEFAULT not-italic font-sans">Shop</span>.
                </span>
            </Link>

            <nav className="hidden md:flex gap-10 text-sm font-bold tracking-widest text-brand-dark uppercase">
                {/* ✅ შეცვლილია /shop-ზე */}
                <Link href="/shop" className="hover:text-brand-DEFAULT transition-colors py-2 relative group">
                    {t('collection')}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-DEFAULT transition-all group-hover:w-full"></span>
                </Link>
                <Link href="/brands" className="hover:text-brand-DEFAULT transition-colors py-2 relative group">
                    {t('brands')}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-DEFAULT transition-all group-hover:w-full"></span>
                </Link>
                <Link href="/sale" className="text-brand-DEFAULT hover:text-pink-700 transition-colors py-2 font-black">
                    {t('sale')}
                </Link>
            </nav>

            <div className="flex items-center gap-3">
                <div className="relative hidden md:block" ref={dropdownRef}>
                    <button 
                        onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                        className="flex items-center justify-between w-24 h-10 px-2 text-xs font-bold text-brand-dark bg-gray-50 border border-gray-200 hover:border-brand-DEFAULT hover:bg-white rounded-lg transition-all duration-200 shadow-sm"
                    >
                        <div className="flex items-center gap-2">
                            <div className="relative w-6 h-4.5 rounded-sm overflow-hidden border border-gray-200 shadow-sm shrink-0">
                                <CurrentFlag className="absolute inset-0 w-full h-full object-cover" />
                            </div>
                            <span>{currentLabel}</span>
                        </div>
                        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isLangMenuOpen && (
                        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden w-24 py-1 flex flex-col z-50 animate-fade-in">
                            {availableLanguages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => handleLanguageChange(lang.code)}
                                    className="px-3 py-2.5 text-left text-xs font-bold hover:bg-brand-light flex items-center gap-2 transition-colors text-gray-600 hover:text-brand-DEFAULT"
                                >
                                    <div className="relative w-6 h-4.5 rounded-sm overflow-hidden border border-gray-200 shadow-sm shrink-0">
                                        <lang.Flag className="absolute inset-0 w-full h-full object-cover" />
                                    </div>
                                    {lang.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

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

      <div className={`fixed inset-0 bg-white z-[100] transform transition-transform duration-300 flex flex-col h-screen ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
                    {t('home')} <ChevronRight className="w-5 h-5 opacity-50" />
                </Link>
                {/* ✅ შეცვლილია /shop-ზე */}
                <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="p-5 bg-gray-50 rounded-2xl active:bg-brand-DEFAULT active:text-white transition flex justify-between items-center shadow-sm">
                    {t('collection')} <ChevronRight className="w-5 h-5 opacity-50" />
                </Link>
                <Link href="/sale" onClick={() => setIsMobileMenuOpen(false)} className="p-5 border-2 border-brand-DEFAULT text-brand-DEFAULT rounded-2xl active:bg-brand-DEFAULT active:text-white transition flex justify-between items-center mt-4 shadow-sm">
                    {t('sale')} <Percent className="w-5 h-5" />
                </Link>
            </nav>

            <div className="mt-8 border-t border-gray-100 pt-8">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{tHeader('selectLanguage')}</h4>
                <div className="grid grid-cols-3 gap-3">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 ${
                                locale === lang.code ? 'border-brand-DEFAULT bg-brand-light text-brand-dark shadow-md transform scale-105' : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-300'
                            }`}
                        >
                            <div className="relative w-8 h-6 rounded-sm overflow-hidden border border-gray-200 shadow-sm mb-2 shrink-0">
                                <lang.Flag className="absolute inset-0 w-full h-full object-cover" />
                            </div>
                            <span className="text-xs font-bold">{lang.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </>
  );
}