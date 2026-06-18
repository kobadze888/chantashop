'use client';

import { useState } from 'react';
import { useRouter } from '@/navigation';
import { useTranslations } from 'next-intl';
import { Search, Loader2, Phone } from 'lucide-react';

export default function TrackOrderContent() {
  const t = useTranslations('Tracking');
  const router = useRouter();

  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !phone) return;

    setIsLoading(true);
    router.push({
      pathname: '/track-order/[id]',
      params: { id: orderId },
      query: { phone },
    });
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-4 flex justify-center items-center">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-light flex items-center justify-center mx-auto mb-6">
          <Search className="w-8 h-8 text-brand-DEFAULT" />
        </div>

        <h1 className="text-3xl font-serif font-black text-brand-dark mb-3">{t('title')}</h1>
        <p className="text-gray-500 mb-8 text-sm leading-relaxed">{t('desc')}</p>

        <form onSubmit={handleSearch} className="space-y-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              inputMode="numeric"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value.replace(/\D/g, ''))}
              placeholder={t('placeholder')}
              className="w-full h-14 pl-12 pr-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-brand-DEFAULT outline-none transition-all font-bold text-lg text-brand-dark placeholder:font-normal placeholder:text-base"
              required
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('phonePlaceholder')}
              className="w-full h-14 pl-12 pr-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-brand-DEFAULT outline-none transition-all font-medium text-brand-dark placeholder:font-normal"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!orderId || !phone || isLoading}
            className="w-full h-14 bg-brand-dark text-white rounded-2xl font-bold hover:bg-brand-DEFAULT transition-colors disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-wide text-sm cursor-pointer"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('btn')}
          </button>
        </form>

        <p className="mt-6 text-xs text-gray-400">{t('hint')}</p>
      </div>
    </div>
  );
}
