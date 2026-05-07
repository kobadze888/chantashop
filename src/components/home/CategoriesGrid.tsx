'use client';
import { useRef, useEffect, useState } from 'react';
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

  // Prevent SSR flash: render placeholder until Swiper hydrates on client
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!categories?.length) return null;

  return (
    <section className="container mx-auto px-3 md:px-6 mt-10 md:mt-14">

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

      {/* Skeleton while Swiper hydrates — same height, no flash */}
      {!mounted ? (
        <div className="flex gap-2.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full aspect-square rounded-full bg-gray-100 animate-pulse" />
              <div className="h-2.5 w-3/4 rounded bg-gray-100 animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
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
          className="pb-1"
        >
          {categories.map((cat) => {
            const imgSrc = cat.image?.sourceUrl;
            const fb  = FALLBACK[cat.slug];
            const bg  = fb?.bg  ?? '#18181b';
            const fg  = fb?.fg  ?? '#ffffff';
            const ini = fb?.initial ?? cat.name.slice(0, 2).toUpperCase();

            return (
              <SwiperSlide key={cat.id}>
                {/*
                  Scale on the Link (whole item: circle + text scale together)
                  → text never gets covered by the growing circle.
                  overflow-visible on SwiperSlide so scaled item isn't clipped by it.
                */}
                <Link
                  href={{ pathname: '/product-category/[slug]', params: { slug: cat.slug } }}
                  className="group flex flex-col items-center gap-1.5 select-none cursor-pointer"
                >
                  {/*
                    No scale on the container — avoids Swiper overflow clipping.
                    Hover effect: ring highlights + image zooms inside the circle.
                  */}
                  <div className="w-full aspect-square rounded-full overflow-hidden relative
                    ring-[2.5px] ring-gray-100 group-hover:ring-brand-DEFAULT
                    transition-all duration-200 group-hover:shadow-md"
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
                        className="absolute inset-0 flex items-center justify-center font-bold select-none"
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
      )}
    </section>
  );
}
