// src/app/[locale]/checkout/success/page.tsx
import { Link } from '@/navigation';
import { getTranslations } from 'next-intl/server'; // ✅ შეცვლილია (Server Side)
import { CheckCircle, Package, Truck, Home, ArrowRight } from 'lucide-react';

export default async function SuccessPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ orderId: string, email: string }> // ✅ Promise ტიპი
}) {
  const t = await getTranslations('Success'); // ✅ await
  const { orderId, email } = await searchParams; // ✅ await searchParams

  // დღევანდელი თარიღი + 3 დღე
  const today = new Date();
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + 3);
  const formattedDate = deliveryDate.toLocaleDateString('ka-GE', { day: 'numeric', month: 'long' });

  return (
    <div className="min-h-screen bg-brand-light/20 pt-32 pb-24 px-4 flex justify-center items-center">
      <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 max-w-2xl w-full text-center border border-white/50 relative overflow-hidden">
        
        {/* Confetti Decoration */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-DEFAULT via-purple-500 to-brand-DEFAULT"></div>

        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-slow">
            <CheckCircle className="w-12 h-12 text-green-500" />
        </div>

        <h1 className="text-3xl md:text-4xl font-serif font-black text-brand-dark mb-4">{t('title')}</h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">{t('subtitle')}</p>

        {/* Order Details Box */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-10 border border-gray-100 inline-block w-full">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                <div className="flex flex-col items-center md:items-start">
                    <span className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-1">{t('orderNumber')}</span>
                    <span className="text-xl font-black text-brand-dark">#{orderId}</span>
                </div>
                <div className="h-8 w-[1px] bg-gray-200 hidden md:block"></div>
                <div className="flex flex-col items-center md:items-end">
                    <span className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-1">{t('emailSent')}</span>
                    <span className="text-brand-dark font-bold">{email}</span>
                </div>
            </div>
        </div>

        {/* Timeline */}
        <div className="relative mb-12 px-4">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0 rounded-full"></div>
            <div className="absolute top-1/2 left-0 w-1/4 h-1 bg-green-500 -translate-y-1/2 z-0 rounded-full transition-all duration-1000"></div>
            
            <div className="relative z-10 flex justify-between">
                <TimelineStep icon={CheckCircle} label={t('timeline_1')} status="active" />
                <TimelineStep icon={Package} label={t('timeline_2')} status="pending" />
                <TimelineStep icon={Truck} label={t('timeline_3')} status="pending" />
                <TimelineStep icon={Home} label={t('timeline_4')} status="pending" />
            </div>
        </div>

        <div className="bg-brand-light/30 rounded-xl p-4 mb-8 text-brand-dark text-sm font-bold flex items-center justify-center gap-2 border border-brand-light">
            <Truck className="w-4 h-4 text-brand-DEFAULT" />
            {t('estDate')}: <span className="text-brand-DEFAULT">{formattedDate}</span>
        </div>

        <Link href="/" className="bg-brand-dark text-white px-10 py-4 rounded-full font-bold hover:bg-brand-DEFAULT transition-all shadow-xl hover:shadow-brand-DEFAULT/30 active:scale-95 inline-flex items-center gap-2">
            {t('backHome')} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function TimelineStep({ icon: Icon, label, status }: { icon: any, label: string, status: 'active' | 'pending' }) {
    const isActive = status === 'active';
    return (
        <div className="flex flex-col items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${isActive ? 'bg-green-500 border-green-100 text-white shadow-lg shadow-green-200' : 'bg-white border-gray-100 text-gray-300'}`}>
                <Icon className="w-4 h-4" />
            </div>
            <span className={`text-[10px] uppercase font-bold tracking-wider transition-colors ${isActive ? 'text-green-600' : 'text-gray-300'}`}>{label}</span>
        </div>
    );
}