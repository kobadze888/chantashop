'use client';

import { Home, LayoutGrid, ShoppingBag, MessageCircle } from 'lucide-react';
import { Link, usePathname } from '@/navigation';
import { useCartStore } from '@/store/cartStore';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

export default function BottomNav() {
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const t = useTranslations('Navigation');
  const tCommon = useTranslations('Common');

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = mounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;

  const navItems = [
    {
      label: t('home'),
      icon: Home,
      href: '/',
      isButton: false
    },
    {
      label: t('shop'),
      icon: LayoutGrid,
      href: '/shop',
      isButton: false
    },
    {
      label: tCommon('cart'),
      icon: ShoppingBag,
      href: '/cart',
      isButton: false,
      badge: cartCount
    },
    {
      label: t('chat'),
      icon: MessageCircle,
      href: '/contact',
      isButton: true,
      onClick: () => {
        window.open('https://wa.me/995555555555', '_blank'); 
      }
    }
  ];

  return (
    // ✅ ცვლილებები ვიზუალის გასაუმჯობესებლად:
    // 1. shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] -> უფრო ღრმა და რბილი ჩრდილი ზემოთ.
    // 2. border-t border-gray-200/50 -> ოდნავ მკვეთრი ზედა ხაზი.
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl text-brand-dark rounded-t-[1.5rem] px-6 pt-3 pb-[calc(5px+env(safe-area-inset-bottom))] flex justify-between items-center z-50 shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.12)] border-t border-gray-200/60">
        {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            if (item.isButton) {
                return (
                    <button 
                        key={index}
                        onClick={item.onClick}
                        className="flex flex-1 flex-col items-center gap-1 text-gray-400 hover:text-brand-dark transition active:scale-95 p-1"
                    >
                        <Icon className="w-6 h-6" />
                        <span className="text-[10px] font-bold uppercase tracking-wide">{item.label}</span>
                    </button>
                );
            }

            return (
                <Link 
                    key={index} 
                    href={item.href} 
                    className={`flex flex-1 flex-col items-center gap-1 transition active:scale-95 p-1 relative group ${isActive ? 'text-brand-DEFAULT' : 'text-gray-400 hover:text-brand-dark'}`}
                >
                    <div className="relative">
                        <Icon className={`w-6 h-6 transition-colors ${isActive ? 'text-brand-DEFAULT' : 'group-hover:text-brand-DEFAULT'}`} />
                        {item.badge !== undefined && item.badge > 0 && (
                            <span className="absolute -top-2 -right-2 bg-brand-DEFAULT text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-sm animate-fade-in border border-white">
                                {item.badge}
                            </span>
                        )}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wide transition-colors ${isActive ? 'text-brand-DEFAULT' : 'group-hover:text-brand-DEFAULT'}`}>
                        {item.label}
                    </span>
                </Link>
            );
        })}
    </div>
  );
}