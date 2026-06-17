'use client';
import { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Grid } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import Image from 'next/image';
import { Link } from '@/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { HomeCategory } from '@/lib/api';
import 'swiper/css';
import 'swiper/css/grid';

interface Props {
  categories: HomeCategory[];
  fallbackImages?: Record<string, string>;
}

/* ── Brand slugs — only these appear in this section ── */
const BRAND_SLUGS = new Set([
  'chanel', 'christian-dior', 'dolce-gabbana', 'fendi', 'gucci',
  'guess', 'luis-vuitton', 'michael-kors', 'prada', 'ysl',
]);

/* ── Fallback colours + initials ── */
const FALLBACK: Record<string, { initial: string; bg: string; fg: string }> = {
  'chanel':         { initial: 'C',   bg: '#0a0a0a', fg: '#fff'    },
  'christian-dior': { initial: 'D',   bg: '#111',    fg: '#fff'    },
  'dolce-gabbana':  { initial: 'D&G', bg: '#1c1c1c', fg: '#D4AF37' },
  'fendi':          { initial: 'F',   bg: '#F5E6C8', fg: '#3D2B1F' },
  'gucci':          { initial: 'G',   bg: '#1B4332', fg: '#D4AF37' },
  'guess':          { initial: 'GU',  bg: '#111',    fg: '#fff'    },
  'luis-vuitton':   { initial: 'LV',  bg: '#5C3317', fg: '#D4AF37' },
  'michael-kors':   { initial: 'MK',  bg: '#1a1a1a', fg: '#C9A96E' },
  'prada':          { initial: 'P',   bg: '#000',    fg: '#fff'    },
  'ysl':            { initial: 'YSL', bg: '#0a0a0a', fg: '#D4AF37' },
};

/* ── SVG ring constants ── */
const R = 44;
const STROKE = 3;
const CIRCUMFERENCE = 2 * Math.PI * R; // ≈ 276.5
const STORY_DURATION = 2000; // ms per photo

/* ── Individual story circle ── */
function StoryCircle({ cat }: { cat: HomeCategory }) {
  const photos: string[] = [
    ...(cat.products?.nodes ?? []).map(p => p.image?.sourceUrl).filter(Boolean),
    cat.image?.sourceUrl,
  ].filter(Boolean) as string[];

  const [idx, setIdx]         = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const fb  = FALLBACK[cat.slug];
  const bg  = fb?.bg  ?? '#18181b';
  const fg  = fb?.fg  ?? '#fff';
  const ini = fb?.initial ?? cat.name.slice(0, 2).toUpperCase();
  const src = photos[idx] ?? null;

  useEffect(() => {
    const t = setInterval(() => {
      setIdx(prev => (prev + 1) % Math.max(photos.length, 1));
      setAnimKey(prev => prev + 1);
    }, STORY_DURATION);
    return () => clearInterval(t);
  }, [photos.length]);

  return (
    <Link
      href={{ pathname: '/product-category/[slug]', params: { slug: cat.slug } }}
      className="group flex flex-col items-center gap-1.5 cursor-pointer select-none"
    >
      {/* ── Story circle ── */}
      <div className="relative w-full aspect-square">

        {/* SVG animated ring */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 96 96"
          style={{ transform: 'rotate(-90deg)' }}
          aria-hidden
        >
          {/* Background track */}
          <circle cx="48" cy="48" r={R} fill="none" stroke="#e5e7eb" strokeWidth={STROKE} />
          {/* Animated pink fill */}
          <circle
            key={animKey}
            cx="48" cy="48" r={R}
            fill="none"
            stroke="#db2777"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE}
            style={{
              animation: `storyFill ${STORY_DURATION}ms linear forwards`,
            }}
          />
        </svg>

        {/* Inner photo circle */}
        <div className="absolute rounded-full overflow-hidden" style={{ inset: `${STROKE + 2}px` }}>
          {src ? (
            <Image
              src={src}
              alt={cat.name}
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 480px) 20vw, (max-width: 768px) 15vw, 11vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: bg }}>
              <span
                className="font-bold select-none"
                style={{
                  color: fg,
                  fontSize: ini.length <= 2
                    ? 'clamp(0.85rem, 2.5vw, 1.25rem)'
                    : 'clamp(0.55rem, 1.6vw, 0.8rem)',
                }}
              >
                {ini}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Name */}
      <span className="text-[10px] md:text-[11px] font-medium text-gray-600 text-center leading-snug line-clamp-2 w-full px-0.5 group-hover:text-brand-dark transition-colors duration-200">
        {cat.name}
      </span>
    </Link>
  );
}

/* ── Main section ── */
export default function CategoriesGrid({ categories }: Props) {
  const t        = useTranslations('Home.Categories');
  const swiperRef = useRef<SwiperType | null>(null);

  const brands = categories.filter(c => BRAND_SLUGS.has(c.slug));
  if (!brands.length) return null;

  return (
    <section className="container mx-auto px-3 md:px-6 mt-10 md:mt-14">
      <style>{`
        @keyframes storyFill {
          from { stroke-dashoffset: ${CIRCUMFERENCE}; }
          to   { stroke-dashoffset: 0; }
        }
        /* Pre-init sizing — mobile 2 rows (wrap), desktop 1 row (nowrap) */
        .cats-swiper:not(.swiper-initialized) .swiper-wrapper { display: flex; flex-wrap: wrap; }
        .cats-swiper:not(.swiper-initialized) .swiper-slide { flex: 0 0 auto; width: calc((100% - 36px) / 4); margin: 0 12px 12px 0; }
        @media (min-width: 480px)  { .cats-swiper:not(.swiper-initialized) .swiper-slide { width: calc((100% - 48px) / 5); } }
        @media (min-width: 640px)  { .cats-swiper:not(.swiper-initialized) .swiper-wrapper { flex-wrap: nowrap; } .cats-swiper:not(.swiper-initialized) .swiper-slide { width: calc((100% - 72px) / 7); margin-bottom: 0; } }
        @media (min-width: 768px)  { .cats-swiper:not(.swiper-initialized) .swiper-slide { width: calc((100% - 84px) / 8); } }
        @media (min-width: 1024px) { .cats-swiper:not(.swiper-initialized) .swiper-slide { width: calc((100% - 96px) / 9); } }
        @media (min-width: 1280px) { .cats-swiper:not(.swiper-initialized) .swiper-slide { width: calc((100% - 108px) / 10); } }
      `}</style>

      <header className="flex items-center justify-between mb-5 md:mb-6">
        <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight text-brand-dark">
          {t('title')}
        </h2>
        <div className="flex items-center gap-1.5 md:gap-2">
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="Previous"
            className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 cursor-pointer
              hover:bg-brand-dark hover:border-brand-dark hover:text-white transition-all duration-150 active:scale-90"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="Next"
            className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 cursor-pointer
              hover:bg-brand-dark hover:border-brand-dark hover:text-white transition-all duration-150 active:scale-90"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      <Swiper
        modules={[Grid]}
        slidesPerView={4}
        grid={{ rows: 2, fill: 'row' }}
        spaceBetween={12}
        onSwiper={(s) => { swiperRef.current = s; }}
        breakpoints={{
          480:  { slidesPerView: 5,  grid: { rows: 2, fill: 'row' }, spaceBetween: 12 },
          640:  { slidesPerView: 7,  grid: { rows: 1 }, spaceBetween: 12 },
          768:  { slidesPerView: 8,  grid: { rows: 1 }, spaceBetween: 14 },
          1024: { slidesPerView: 9,  grid: { rows: 1 }, spaceBetween: 14 },
          1280: { slidesPerView: 10, grid: { rows: 1 }, spaceBetween: 16 },
        }}
        className="cats-swiper pb-1"
      >
        {brands.map((cat) => (
          <SwiperSlide key={cat.id}>
            <StoryCircle cat={cat} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
