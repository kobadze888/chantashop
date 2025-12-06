'use client';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ShoppingBag } from 'lucide-react';

export default function Hero() {
  const t = useTranslations('Hero');

  return (
    <div className="relative h-[95vh] md:h-[800px] w-full overflow-hidden rounded-b-[2.5rem] md:rounded-b-none shadow-xl md:shadow-none">
        <Image 
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
            alt="Hero Banner"
            fill
            className="object-cover"
            priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent md:bg-gradient-to-r md:from-black/60 md:to-transparent"></div>
        
        <div className="absolute bottom-12 left-6 right-6 md:bottom-24 md:left-20 md:max-w-2xl text-white">
            <span className="bg-mocha-DEFAULT text-white text-xs md:text-sm font-bold px-3 py-1 md:px-4 md:py-1.5 rounded mb-4 md:mb-6 inline-block tracking-wider">
                {t('new_season_label')}
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-4 md:mb-6 leading-[0.9] tracking-tight">
                {t.rich('title', { br: () => <br /> })}
            </h1>
            <p className="text-gray-200 mb-8 text-sm md:text-lg font-medium max-w-md md:leading-relaxed hidden md:block">
                {t('subtitle')}
            </p>
            
            <div className="flex gap-3 md:hidden mb-4">
                 <span className="text-[10px] font-bold text-white/80 border border-white/30 px-3 py-1 rounded-full backdrop-blur-sm">{t('new_in_tag')}</span>
                 <span className="text-[10px] font-bold text-white/80 border border-white/30 px-3 py-1 rounded-full backdrop-blur-sm">{t('premium_tag')}</span>
            </div>

            <button className="w-full md:w-auto bg-white text-mocha-dark px-10 py-4 rounded-2xl md:rounded-full font-bold text-sm md:text-base hover:bg-mocha-DEFAULT hover:text-white transition-all transform hover:scale-105 shadow-lg shadow-black/20">
                {t('button_text')}
            </button>
        </div>

        <div className="absolute bottom-12 right-12 hidden lg:block animate-fade-in">
            <div className="glass-panel p-4 rounded-2xl flex items-center gap-4 w-80 shadow-2xl border border-white/30 backdrop-blur-xl">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden">
                    <Image 
                        src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=150"
                        alt="Preview"
                        fill
                        className="object-cover"
                    />
                </div>
                <div>
                    <div className="text-[10px] font-bold text-mocha-dark/60 uppercase tracking-wider">{t('best_seller_tag')}</div>
                    <div className="font-bold text-mocha-dark text-lg">{t('product_name')}</div>
                    <div className="text-mocha-DEFAULT font-black">{t('product_price')}</div>
                </div>
                <div className="ml-auto bg-mocha-dark text-white p-3 rounded-full cursor-pointer hover:bg-mocha-DEFAULT transition">
                    <ShoppingBag className="w-4 h-4" />
                </div>
            </div>
        </div>
    </div>
  );
}