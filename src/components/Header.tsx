'use client';

import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/navigation';

export default function Header() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-2xl font-bold text-black">
          CHANTA<span className="text-blue-600">SHOP</span>
        </Link>

        <nav className="flex gap-4">
          <div className="flex gap-2 text-sm font-medium">
            <Link 
              href={pathname} 
              locale="ka" 
              className={`p-1 ${locale === 'ka' ? 'text-blue-600 font-bold' : 'text-gray-500'}`}
            >
              KA
            </Link>
            <span className="text-gray-300">|</span>
            <Link 
              href={pathname} 
              locale="en" 
              className={`p-1 ${locale === 'en' ? 'text-blue-600 font-bold' : 'text-gray-500'}`}
            >
              EN
            </Link>
            <span className="text-gray-300">|</span>
            <Link 
              href={pathname} 
              locale="ru" 
              className={`p-1 ${locale === 'ru' ? 'text-blue-600 font-bold' : 'text-gray-500'}`}
            >
              RU
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}