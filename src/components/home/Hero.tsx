'use client';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';

export default function Hero() {
  const t = useTranslations('Home.Hero');

  return (
    <section className="relative mx-3 md:container md:mx-auto mt-24 md:mt-32 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl bg-gradient-to-br from-brand-dark via-zinc-900 to-brand-dark">
      <div className="grid md:grid-cols-2 min-h-[78vh] md:min-h-[640px]">

        {/* ═══ Text ═══ */}
        <div className="relative z-20 flex flex-col justify-center px-7 md:px-16 py-14 md:py-20 text-white order-2 md:order-1">

          {/* Badge */}
          <span className="inline-flex items-center gap-2 self-start bg-white/10 backdrop-blur-md border border-white/15 text-[10px] md:text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em] mb-6 md:mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-DEFAULT" />
            {t('badge')}
          </span>

          {/* Title */}
          <h1 className="font-serif font-black leading-[1.05] tracking-tight text-[2.4rem] sm:text-5xl md:text-[3.6rem] lg:text-[4.2rem] mb-5 md:mb-6">
            ჩანთებისა და
            <br />
            <span className="text-brand-DEFAULT">აქსესუარების</span>
            <br />
            ონლაინ მაღაზია
          </h1>

          {/* Subtitle */}
          <p className="text-white/65 text-sm md:text-base max-w-sm mb-8 md:mb-10 leading-relaxed">
            {t('subtitle')}
          </p>

          {/* CTA */}
          <div>
            <Link
              href="/shop"
              className="group inline-flex items-center justify-center gap-2.5 bg-white text-brand-dark px-8 py-4 rounded-full font-bold text-sm hover:bg-brand-DEFAULT hover:text-white transition-all shadow-xl shadow-black/30 w-full sm:w-auto"
            >
              {t('cta')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-6 md:gap-10 mt-10 md:mt-12 pt-7 border-t border-white/10">
            <div>
              <div className="text-2xl md:text-3xl font-serif font-black">10+</div>
              <div className="text-[10px] text-white/45 uppercase tracking-widest mt-0.5">ბრენდი</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-serif font-black">1-2 დ.</div>
              <div className="text-[10px] text-white/45 uppercase tracking-widest mt-0.5">ჩაბარება</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-serif font-black">6₾</div>
              <div className="text-[10px] text-white/45 uppercase tracking-widest mt-0.5">მიწოდება</div>
            </div>
          </div>
        </div>

        {/* ═══ Photo ═══ */}
        <div className="relative h-[52vh] md:h-auto order-1 md:order-2 overflow-hidden">
          <Image
            src="/images/hero.webp"
            alt="ChantaShop — ჩანთები და აქსესუარები"
            fill
            className="object-cover object-top"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Mobile: გამუქება ქვემოდან (text-ის ქვეშ გადადის) */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-brand-dark/10 to-transparent md:hidden" />
          {/* Desktop: გამუქება მარცხნიდან (text col-ის მხარეს) */}
          <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-brand-dark/50 via-transparent to-transparent" />
        </div>

      </div>
    </section>
  );
}
