'use client';

import { useState } from 'react';
import { useRouter } from '@/navigation';
import { useTranslations } from 'next-intl';
import { Search, Loader2, Mail } from 'lucide-react'; 

export default function TrackOrderPage() {
  const t = useTranslations('Tracking');
  const router = useRouter();
  
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !email) return;
    
    setIsLoading(true);
    router.push({
        pathname: '/track-order/[id]',
        params: { id: orderId },
        query: { email: email }
    });
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-4 flex justify-center items-center">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-serif font-black text-brand-dark mb-4">{t('title')}</h1>
        <p className="text-gray-500 mb-8">{t('desc')}</p>

        <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                    type="text" 
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder={t('placeholder')}
                    className="w-full h-14 pl-12 pr-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-brand-DEFAULT outline-none transition-all font-bold text-lg text-brand-dark placeholder:font-normal"
                    required
                />
            </div>

            <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="თქვენი ელ-ფოსტა"
                    className="w-full h-14 pl-12 pr-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-brand-DEFAULT outline-none transition-all font-medium text-brand-dark placeholder:font-normal"
                    required
                />
            </div>

            <button 
                type="submit"
                disabled={!orderId || !email || isLoading}
                className="w-full h-14 bg-brand-dark text-white rounded-2xl font-bold hover:bg-brand-DEFAULT transition-colors disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
            >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('btn')}
            </button>
        </form>
      </div>
    </div>
  );
}