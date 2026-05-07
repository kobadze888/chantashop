'use client';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';

export default function Hero() {
  const t = useTranslations('Home.Hero');

  return (
    <section className="relative mx-3 md:container md:mx-auto mt-24 md:mt-32 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl bg-gradient-to-br from-brand-dark via-zinc-900 to-brand-dark">
      <div className="flex flex-col md:flex-row md:items-stretch">

        {/* ═══════════════════════════════════════
            TEXT  (mobile: order-2 below / desktop: left)
        ════════════════════════════════════════ */}
        <div className="order-2 md:order-1 flex flex-col justify-center
          flex-1 min-w-0
          px-7 sm:px-10 md:px-10 lg:px-14
          py-10 md:py-20 lg:py-24
          text-white">

          {/* Badge */}
          <span className="inline-flex items-center gap-2 self-start
            bg-white/10 backdrop-blur-md border border-white/15
            text-[10px] font-bold px-4 py-1.5 rounded-full
            uppercase tracking-[0.2em] mb-5 md:mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-DEFAULT shrink-0" />
            {t('badge')}
          </span>

          {/* Title */}
          <h1 className="font-serif font-black uppercase tracking-wider leading-[1.15] mb-4 md:mb-5
            text-[1.7rem] sm:text-[2rem] md:text-[1.9rem] lg:text-[2.4rem] xl:text-[2.8rem]">
            ჩანთებისა და
            <br />
            <span className="text-brand-DEFAULT">აქსესუარების</span>
            <br />
            ონლაინ მაღაზია
          </h1>

          {/* Subtitle */}
          <p className="text-white/60 text-sm leading-relaxed
            max-w-[280px] md:max-w-[300px] lg:max-w-xs mb-7 md:mb-8">
            {t('subtitle')}
          </p>

          {/* CTA */}
          <Link
            href="/shop"
            className="group inline-flex items-center justify-center gap-2.5
              bg-white text-brand-dark px-7 py-3.5 rounded-full font-bold text-sm
              hover:bg-brand-DEFAULT hover:text-white transition-all
              shadow-lg shadow-black/25
              w-full sm:w-auto self-start"
          >
            {t('cta')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Stats */}
          <div className="flex gap-5 md:gap-7 lg:gap-10
            mt-8 md:mt-9 pt-6 md:pt-7 border-t border-white/10">
            {[
              { num: '10+',    label: 'ბრენდი'   },
              { num: '1-2 დ.', label: 'ჩაბარება' },
              { num: '6₾',    label: 'მიწოდება' },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="text-xl md:text-2xl lg:text-3xl font-serif font-black">{num}</div>
                <div className="text-[9px] md:text-[10px] text-white/40 uppercase tracking-widest mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════
            PHOTO  (mobile: order-1 top / desktop: right)
            კვადრატული: aspect-[2048/1881] ≈ 1:1
            desktop-ზე flex stretch — სიმაღლე = ტექსტის column
        ════════════════════════════════════════ */}
        {/* Mobile */}
        <div className="order-1 md:hidden relative w-full aspect-[2048/1881]">
          <Image
            src="/images/banner.webp"
            alt="ChantaShop — ჩანთები და აქსესუარები"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>

        {/* Desktop / Tablet */}
        <div className="order-2 hidden md:block relative
          flex-shrink-0
          md:w-[46%] lg:w-[48%] xl:w-[50%]">
          <Image
            src="/images/banner.webp"
            alt="ChantaShop — ჩანთები და აქსესუარები"
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 1024px) 46vw, (max-width: 1280px) 48vw, 50vw"
          />
        </div>

      </div>
    </section>
  );
}
