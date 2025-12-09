// src/app/[locale]/track-order/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from '@/navigation';
import { useTranslations } from 'next-intl';
import { Search, Loader2 } from 'lucide-react';

export default function TrackOrderPage() {
  const t = useTranslations('Tracking');
  const router = useRouter();
  const [orderId, setOrderId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;
    setIsLoading(true);
    router.push(`/track-order/${orderId}`);
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-4 flex justify-center items-center">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-serif font-black text-brand-dark mb-4">{t('title')}</h1>
        <p className="text-gray-500 mb-8">{t('desc')}</p>

        <form onSubmit={handleSearch} className="relative">
            <input 
                type="text" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder={t('placeholder')}
                className="w-full h-14 pl-6 pr-14 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-brand-DEFAULT outline-none transition-all font-bold text-lg text-brand-dark placeholder:font-normal"
            />
            <button 
                type="submit"
                disabled={!orderId || isLoading}
                className="absolute right-2 top-2 h-10 w-10 bg-brand-dark text-white rounded-xl flex items-center justify-center hover:bg-brand-DEFAULT transition-colors disabled:opacity-50"
            >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            </button>
        </form>
      </div>
    </div>
  );
}