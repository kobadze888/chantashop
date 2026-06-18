'use client';

import { Home, LayoutGrid, ShoppingBag, MessageCircle, type LucideIcon } from 'lucide-react';
import { Link, usePathname } from '@/navigation';
import { useCartStore } from '@/store/cartStore';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ComponentProps } from 'react';

type NavHref = ComponentProps<typeof Link>['href'];

type NavItem =
  | { label: string; icon: LucideIcon; isButton: false; href: NavHref; badge?: number }
  | { label: string; icon: LucideIcon; isButton: true; onClick: () => void };

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

  const navItems: NavItem[] = [
    { label: t('home'), icon: Home, href: '/', isButton: false },
    { label: t('shop'), icon: LayoutGrid, href: '/shop', isButton: false },
    { label: tCommon('cart'), icon: ShoppingBag, href: '/cart', isButton: false, badge: cartCount },
    {
      label: t('chat'),
      icon: MessageCircle,
      isButton: true,
      onClick: () => {
        window.open('https://wa.me/995591290610', '_blank');
      },
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl text-brand-dark rounded-t-[1rem] px-4 pt-2 pb-[calc(4px+env(safe-area-inset-bottom))] flex justify-between items-center z-50 shadow-[0_-6px_20px_-4px_rgba(0,0,0,0.1)] border-t border-gray-200/60">
        {navItems.map((item, index) => {
            const Icon = item.icon;

            if (item.isButton) {
                return (
                    <button
                        key={index}
                        onClick={item.onClick}
                        className="flex flex-1 flex-col items-center gap-0.5 text-gray-400 hover:text-brand-dark transition active:scale-95 py-1"
                    >
                        <Icon className="w-5 h-5" />
                        <span className="text-[9px] font-bold uppercase tracking-wide">{item.label}</span>
                    </button>
                );
            }

            const isActive = pathname === item.href;
            return (
                <Link
                    key={index}
                    href={item.href}
                    className={`flex flex-1 flex-col items-center gap-0.5 transition active:scale-95 py-1 relative group ${isActive ? 'text-brand-DEFAULT' : 'text-gray-400 hover:text-brand-dark'}`}
                >
                    <div className="relative">
                        <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-brand-DEFAULT' : 'group-hover:text-brand-DEFAULT'}`} />
                        {item.badge !== undefined && item.badge > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-brand-DEFAULT text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold shadow-sm animate-fade-in border border-white">
                                {item.badge}
                            </span>
                        )}
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-wide transition-colors ${isActive ? 'text-brand-DEFAULT' : 'group-hover:text-brand-DEFAULT'}`}>
                        {item.label}
                    </span>
                </Link>
            );
        })}
    </div>
  );
}
