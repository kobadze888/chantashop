'use client';
import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Image from 'next/image';
import { Link } from '@/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { HomeCategory } from '@/lib/api';
import 'swiper/css';

interface Props {
  categories: HomeCategory[];
  fallbackImages?: Record<string, string>;
}

/* ── Fallback colours + initials (when WP has no photo) ── */
const FALLBACK: Record<string, { initial: string; bg: string; fg: string }> = {
  'chanel':                     { initial: 'C',   bg: '#0a0a0a', fg: '#fff'    },
  'christian-dior':             { initial: 'D',   bg: '#111',    fg: '#fff'    },
  'dolce-gabbana':              { initial: 'D&G', bg: '#1c1c1c', fg: '#D4AF37' },
  'fendi':                      { initial: 'F',   bg: '#F5E6C8', fg: '#3D2B1F' },
  'gucci':                      { initial: 'G',   bg: '#1B4332', fg: '#D4AF37' },
  'guess':                      { initial: 'GU',  bg: '#111',    fg: '#fff'    },
  'luis-vuitton':               { initial: 'LV',  bg: '#5C3317', fg: '#D4AF37' },
  'michael-kors':               { initial: 'MK',  bg: '#1a1a1a', fg: '#C9A96E' },
  'prada':                      { initial: 'P',   bg: '#000',    fg: '#fff'    },
  'ysl':                        { initial: 'YSL', bg: '#0a0a0a', fg: '#D4AF37' },
  'luqsi':                      { initial: 'L',   bg: '#1a0a2e', fg: '#fff'    },
  'ekonomi':                    { initial: 'E',   bg: '#064e3b', fg: '#fff'    },
  'qalis_chantebi':             { initial: 'Q',   bg: '#4c1d95', fg: '#fff'    },
  'naturaluri-tyavis-chantebi': { initial: 'N',   bg: '#78350f', fg: '#fff'    },
  'kolgebi':                    { initial: 'K',   bg: '#0c4a6e', fg: '#fff'    },
};

export default function CategoriesGrid({ categories }: Props) {
  const t = useTranslations('Home.Categories');
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  if (!categories?.length) return null;

  return (
    <section className="container mx-auto px-3 md:px-6 mt-10 md:mt-14">
      {/*
        Pre-init slide sizing: the selector targets Swiper BEFORE its JS adds
        `.swiper-initialized`. So on SSR / first paint slides already have
        correct widths → no flash, no skeleton needed. After init, Swiper's
        inline styles win (specificity).
      */}
      <style>{`
        .cats-swiper:not(.swiper-initialized) .swiper-wrapper { display: flex; }
        .cats-swiper:not(.swiper-initialized) .swiper-slide {
          flex: 0 0 auto;
          width: calc((100% - 40px) / 5);
          margin-right: 10px;
        }
        .cats-swiper:not(.swiper-initialized) .swiper-slide:last-child { margin-right: 0; }
        @media (min-width: 480px)  { .cats-swiper:not(.swiper-initialized) .swiper-slide { width: calc((100% - 50px) / 6);  margin-right: 10px; } }
        @media (min-width: 640px)  { .cats-swiper:not(.swiper-initialized) .swiper-slide { width: calc((100% - 72px) / 7);  margin-right: 12px; } }
        @media (min-width: 768px)  { .cats-swiper:not(.swiper-initialized) .swiper-slide { width: calc((100% - 98px) / 8);  margin-right: 14px; } }
        @media (min-width: 1024px) { .cats-swiper:not(.swiper-initialized) .swiper-slide { width: calc((100% - 112px) / 9); margin-right: 14px; } }
        @media (min-width: 1280px) { .cats-swiper:not(.swiper-initialized) .swiper-slide { width: calc((100% - 144px) / 10); margin-right: 16px; } }
      `}</style>

      {/* Header */}
      <header className="flex items-center justify-between mb-5 md:mb-6">
        <h2 className="text-lg md:text-xl font-semibold text-brand-dark">
          {t('title')}
        </h2>
        <div className="flex items-center gap-1.5 md:gap-2">
          <button
            ref={prevRef}
            aria-label="Previous"
            className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 cursor-pointer
              hover:bg-brand-dark hover:border-brand-dark hover:text-white transition-all duration-150 active:scale-90"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            ref={nextRef}
            aria-label="Next"
            className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 cursor-pointer
              hover:bg-brand-dark hover:border-brand-dark hover:text-white transition-all duration-150 active:scale-90"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      <Swiper
        modules={[Navigation]}
        slidesPerView={5}
        spaceBetween={10}
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        onBeforeInit={(swiper) => {
          // @ts-expect-error swiper navigation refs assigned post-init
          swiper.params.navigation.prevEl = prevRef.current;
          // @ts-expect-error swiper navigation refs assigned post-init
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        breakpoints={{
          480:  { slidesPerView: 6,  spaceBetween: 10 },
          640:  { slidesPerView: 7,  spaceBetween: 12 },
          768:  { slidesPerView: 8,  spaceBetween: 14 },
          1024: { slidesPerView: 9,  spaceBetween: 14 },
          1280: { slidesPerView: 10, spaceBetween: 16 },
        }}
        className="cats-swiper pb-1"
      >
        {categories.map((cat) => {
          const imgSrc = cat.image?.sourceUrl;
          const fb  = FALLBACK[cat.slug];
          const bg  = fb?.bg  ?? '#18181b';
          const fg  = fb?.fg  ?? '#ffffff';
          const ini = fb?.initial ?? cat.name.slice(0, 2).toUpperCase();

          return (
            <SwiperSlide key={cat.id}>
              <Link
                href={{ pathname: '/product-category/[slug]', params: { slug: cat.slug } }}
                className="group flex flex-col items-center gap-1.5 select-none cursor-pointer"
              >
                {/*
                  Inset box-shadow for hover ring — renders INSIDE the circle's
                  border, physically cannot be clipped by parent overflow:hidden.
                  Image zooms inside the rounded crop on hover.
                */}
                <div
                  className="w-full aspect-square rounded-full overflow-hidden relative
                    transition-shadow duration-200
                    group-hover:shadow-[inset_0_0_0_3px_#db2777]"
                  style={!imgSrc ? { background: bg } : undefined}
                >
                  {imgSrc ? (
                    <Image
                      src={imgSrc}
                      alt={cat.name}
                      fill
                      className="object-cover object-center transition-transform duration-300 group-hover:scale-110"
                      sizes="(max-width: 480px) 20vw, (max-width: 768px) 15vw, 11vw"
                    />
                  ) : (
                    <span
                      className="absolute inset-0 flex items-center justify-center font-bold select-none transition-transform duration-300 group-hover:scale-110"
                      style={{
                        color: fg,
                        fontSize: ini.length <= 2
                          ? 'clamp(0.85rem, 2.5vw, 1.25rem)'
                          : 'clamp(0.55rem, 1.6vw, 0.8rem)',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {ini}
                    </span>
                  )}
                </div>

                <span className="text-[10px] md:text-[11px] font-medium text-gray-600 text-center leading-snug line-clamp-2 w-full px-0.5 group-hover:text-brand-dark transition-colors duration-200">
                  {cat.name}
                </span>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}
