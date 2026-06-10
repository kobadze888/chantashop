'use client';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';

export default function Hero() {
  const t = useTranslations('Home.Hero');

  return (
    <section className="relative mx-3 md:container md:mx-auto mt-24 md:mt-32
      rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl
      bg-brand-dark">

      {/* ── Looping background video ── */}
      <div className="relative w-full
        h-[78vh] min-h-[480px] sm:h-[72vh] lg:h-[86vh] lg:max-h-[800px]">

        <video
          className="absolute inset-0 w-full h-full object-cover object-center"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/videos/hero-poster.jpg"
          aria-hidden
        >
          <source src="/videos/hero.webm" type="video/webm" />
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>

        {/* ── Overlays for legibility ── */}
        {/* Bottom-up dark gradient (anchors text) */}
        <div className="absolute inset-0 pointer-events-none
          bg-gradient-to-t from-black/85 via-black/35 to-black/20" />
        {/* Slight overall tint */}
        <div className="absolute inset-0 pointer-events-none bg-black/10" />

        {/* ═══════════════════════════════════════
            CONTENT — centered on mobile, bottom-left on desktop
        ════════════════════════════════════════ */}
        <div className="relative z-10 h-full flex flex-col
          items-center justify-end text-center
          md:items-start md:text-left
          px-6 sm:px-10 md:px-12 lg:px-16
          pb-10 sm:pb-12 md:pb-16 lg:pb-20
          pt-24
          text-white">

          {/* Badge */}
          <span className="inline-flex items-center gap-2
            bg-white/10 backdrop-blur-md border border-white/15
            text-[10px] font-medium px-4 py-1.5 rounded-full
            uppercase tracking-[0.12em] mb-4 md:mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-DEFAULT shrink-0 animate-pulse" />
            {t('badge')}
          </span>

          {/* Title */}
          <h1 className="font-sans font-bold tracking-tight leading-[1.08]
            mb-3 md:mb-4 drop-shadow-lg
            text-[2rem] sm:text-[2.6rem] md:text-[3rem] lg:text-[3.6rem] xl:text-[4rem]">
            {t('titleLine1')}{' '}
            <span className="text-brand-DEFAULT">{t('titleHighlight')}</span>
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            {t('titleLine3')}
          </h1>

          {/* Subtitle */}
          <p className="text-white/75 text-sm md:text-base leading-relaxed
            max-w-[340px] md:max-w-[420px] mb-6 md:mb-8">
            {t('subtitle')}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center
            gap-3 w-full sm:w-auto">
            <Link
              href="/shop"
              className="group inline-flex items-center justify-center gap-2.5
                bg-white text-brand-dark px-7 py-3.5 rounded-full font-bold text-sm
                hover:bg-brand-DEFAULT hover:text-white transition-all
                shadow-lg shadow-black/30"
            >
              {t('cta')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2.5
                bg-white/10 backdrop-blur-md text-white border border-white/30
                px-7 py-3.5 rounded-full font-bold text-sm
                hover:bg-white/20 transition-all"
            >
              {t('ctaSecondary')}
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-6 md:gap-9 lg:gap-12
            mt-7 md:mt-9 pt-5 md:pt-7 border-t border-white/15
            w-full sm:w-auto justify-center md:justify-start">
            {[
              { num: t('stats.brandsNum'),   label: t('stats.brandsLabel')   },
              { num: t('stats.deliveryNum'), label: t('stats.deliveryLabel') },
              { num: t('stats.shippingNum'), label: t('stats.shippingLabel') },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="text-xl md:text-2xl lg:text-3xl font-sans font-bold drop-shadow">{num}</div>
                <div className="text-[9px] md:text-[10px] text-white/55 uppercase tracking-widest mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
