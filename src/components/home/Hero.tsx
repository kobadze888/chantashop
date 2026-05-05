'use client';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';

export default function Hero() {
  const t = useTranslations('Home.Hero');

  return (
    <section className="relative mx-3 md:container md:mx-auto mt-24 md:mt-32 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl bg-gradient-to-br from-brand-dark via-zinc-900 to-brand-dark">
      <div className="grid md:grid-cols-2 min-h-[78vh] md:min-h-[640px]">

        {/* Text */}
        <div className="relative z-20 flex flex-col justify-center px-7 md:px-16 py-16 md:py-20 text-white order-2 md:order-1">
          <span className="inline-flex items-center gap-2 self-start bg-white/10 backdrop-blur-md border border-white/15 text-[10px] md:text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em] mb-6 md:mb-8">
            <Sparkles className="w-3 h-3 text-brand-DEFAULT" />
            {t('badge')}
          </span>

          <h1 className="font-serif italic font-black leading-[0.92] tracking-tight text-5xl sm:text-6xl md:text-[5.5rem] lg:text-[6.5rem] mb-5 md:mb-7">
            Iconic
            <br />
            <span className="text-brand-DEFAULT not-italic font-sans">Luxury.</span>
          </h1>

          <p className="text-white/70 text-sm md:text-base max-w-md mb-8 md:mb-10 leading-relaxed">
            {t('subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="/shop"
              className="group bg-white text-brand-dark px-8 py-4 rounded-full font-bold text-sm hover:bg-brand-DEFAULT hover:text-white transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/30"
            >
              {t('cta')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/shop"
              className="px-8 py-4 rounded-full font-bold text-sm text-white border border-white/20 hover:bg-white/10 transition-all flex items-center justify-center"
            >
              {t('ctaSecondary')}
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-6 md:gap-10 mt-10 md:mt-14 pt-8 border-t border-white/10">
            <div>
              <div className="text-2xl md:text-3xl font-serif font-black">10+</div>
              <div className="text-xs text-white/50 uppercase tracking-widest mt-1">Brands</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-serif font-black">500+</div>
              <div className="text-xs text-white/50 uppercase tracking-widest mt-1">Items</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-serif font-black">4.9★</div>
              <div className="text-xs text-white/50 uppercase tracking-widest mt-1">Rating</div>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="relative h-[55vh] md:h-auto order-1 md:order-2 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1600&auto=format&fit=crop"
            alt="ChantaShop Hero"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent md:bg-gradient-to-r md:from-brand-dark/40 md:via-transparent md:to-transparent" />
        </div>
      </div>
    </section>
  );
}
