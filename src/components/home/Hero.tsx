'use client';
import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';

export default function Hero() {
  const t = useTranslations('Home.Hero');
  const videoRef = useRef<HTMLVideoElement>(null);

  // iOS Safari sometimes leaves the hero video paused (showing a play overlay)
  // after client-side navigation or bfcache restore. Force it back to playing.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const tryPlay = () => {
      v.muted = true;
      const p = v.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    };
    tryPlay();
    const onVisible = () => { if (document.visibilityState === 'visible') tryPlay(); };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('pageshow', tryPlay);
    window.addEventListener('focus', tryPlay);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('pageshow', tryPlay);
      window.removeEventListener('focus', tryPlay);
    };
  }, []);

  const stats = [
    { num: t('stats.brandsNum'),   label: t('stats.brandsLabel')   },
    { num: t('stats.deliveryNum'), label: t('stats.deliveryLabel') },
    { num: t('stats.shippingNum'), label: t('stats.shippingLabel') },
  ];

  return (
    <section className="relative mx-3 md:container md:mx-auto mt-24 md:mt-32
      rounded-[1.75rem] md:rounded-[3rem] overflow-hidden shadow-2xl bg-brand-dark">

      <div className="relative w-full
        h-[80vh] min-h-[500px] max-h-[680px]
        sm:h-[70vh] sm:max-h-[620px]
        lg:h-[86vh] lg:max-h-[820px]">

        {/* Poster — instant paint before video loads */}
        <img
          src="/videos/hero-desktop-poster.jpg"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Looping background video (same clip across all devices) */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover object-center"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/videos/hero-desktop-poster.jpg"
          aria-hidden
          tabIndex={-1}
          disablePictureInPicture
          controls={false}
        >
          <source src="/videos/hero-desktop.mp4" type="video/mp4" />
        </video>

        {/* Legibility overlays */}
        <div className="absolute inset-0 pointer-events-none
          bg-gradient-to-t from-black/85 via-black/30 to-black/15" />
        <div className="absolute inset-0 pointer-events-none bg-black/10" />

        {/* ── Content: centred-bottom on mobile, bottom-left on desktop ── */}
        <div className="relative z-10 h-full flex flex-col
          items-start justify-end text-left
          px-4 sm:px-10 md:px-12 lg:px-16
          pb-12 sm:pb-12 md:pb-16 lg:pb-20 pt-24
          text-white">

          <div className="w-full max-w-md md:max-w-xl flex flex-col items-start">

            {/* Title — serif (Noto Serif Georgian), Mkhedruli.
                Sizes kept so "ჩანთებისა და აქსესუარების" stays on one line. */}
            <h1 className="font-display font-bold leading-tight tracking-tighter
              mb-3 md:mb-4 drop-shadow-lg
              text-[1.5rem] sm:text-3xl md:text-4xl">
              <span className="whitespace-nowrap">
                {t('titleLine1').split('&').map((part, i, arr) => (
                  <span key={i}>{part}{i < arr.length - 1 && <span className="font-sans">&amp;</span>}</span>
                ))}
                {' '}{t('titleHighlight')}
              </span>
              <br />
              <span className="text-brand-DEFAULT whitespace-nowrap">{t('titleLine3')}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-white/70 text-[13px] sm:text-sm md:text-base leading-relaxed
              max-w-[330px] md:max-w-[440px] mb-6 md:mb-8">
              {t('subtitle')}
            </p>

            {/* CTA */}
            <div>
              <Link
                href="/shop"
                className="group inline-flex items-center justify-center gap-2.5
                  bg-white text-brand-dark px-7 py-3.5 rounded-full font-bold text-sm
                  hover:bg-brand-DEFAULT hover:text-white transition-all
                  shadow-lg shadow-black/30 active:scale-[0.98]">
                {t('cta')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-start gap-7 md:gap-10
              mt-9 md:mt-9 pt-6 md:pt-7 border-t border-white/15
              justify-start">
              {stats.map(({ num, label }) => (
                <div key={label} className="text-left">
                  <div className="text-lg sm:text-xl md:text-2xl lg:text-[1.7rem] font-bold leading-none drop-shadow">
                    {num}
                  </div>
                  <div className="text-[8.5px] sm:text-[9px] md:text-[10px] text-white/55 uppercase tracking-[0.14em] mt-1.5 whitespace-nowrap">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
