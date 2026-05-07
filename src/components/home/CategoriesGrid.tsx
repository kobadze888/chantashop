'use client';
import Image from 'next/image';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import { ShoppingBag, Crown, Tag, Layers, Umbrella } from 'lucide-react';
import type { HomeCategory } from '@/lib/api';

interface Props {
  categories: HomeCategory[];
  fallbackImages?: Record<string, string>;
}

/* ── Brand monogram configs ── */
const BRAND: Record<string, { mono: string; bg: string; fg: string }> = {
  'chanel':          { mono: 'CC',  bg: '#000000', fg: '#FFFFFF' },
  'christian-dior':  { mono: 'CD',  bg: '#0D0D0D', fg: '#FFFFFF' },
  'dolce-gabbana':   { mono: 'D&G', bg: '#1C1C1C', fg: '#D4AF37' },
  'fendi':           { mono: 'FF',  bg: '#F5E6C8', fg: '#3D2B1F' },
  'gucci':           { mono: 'GG',  bg: '#1B4332', fg: '#D4AF37' },
  'guess':           { mono: '?',   bg: '#111111', fg: '#FFFFFF' },
  'luis-vuitton':    { mono: 'LV',  bg: '#5C3317', fg: '#D4AF37' },
  'michael-kors':    { mono: 'MK',  bg: '#222222', fg: '#C9A96E' },
  'prada':           { mono: '▲',   bg: '#000000', fg: '#FFFFFF' },
  'ysl':             { mono: 'YSL', bg: '#0A0A0A', fg: '#D4AF37' },
};

/* ── Generic category icon configs ── */
const ICON: Record<string, { Icon: React.ElementType; bg: string; fg: string }> = {
  'luqsi':                       { Icon: Crown,       bg: '#DB2777', fg: '#FFFFFF' },
  'ekonomi':                     { Icon: Tag,         bg: '#059669', fg: '#FFFFFF' },
  'qalis_chantebi':              { Icon: ShoppingBag, bg: '#7C3AED', fg: '#FFFFFF' },
  'naturaluri-tyavis-chantebi':  { Icon: Layers,      bg: '#92400E', fg: '#FFFFFF' },
  'kolgebi':                     { Icon: Umbrella,    bg: '#0284C7', fg: '#FFFFFF' },
};

export default function CategoriesGrid({ categories }: Props) {
  const t = useTranslations('Home.Categories');

  return (
    <section className="container mx-auto px-3 md:px-6 mt-10 md:mt-14">

      {/* Header */}
      <header className="flex items-end justify-between mb-6 md:mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-brand-DEFAULT font-medium mb-1.5">
            {t('subtitle')}
          </p>
          <h2 className="text-xl md:text-[1.75rem] font-sans font-semibold text-brand-dark tracking-tight leading-snug">
            {t('title')}
          </h2>
        </div>
      </header>

      {/* Grid — 4 cols mobile → 5 tablet → 6 md → 8 lg */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4">
        {categories.map((cat) => {
          const imgSrc = cat.image?.sourceUrl;
          const b  = BRAND[cat.slug];
          const ic = ICON[cat.slug];
          const shortMono = b && b.mono.length <= 2;

          return (
            <Link
              key={cat.id}
              href={{ pathname: '/product-category/[slug]', params: { slug: cat.slug } }}
              className="group flex flex-col items-center gap-1.5"
            >
              {/* Square card */}
              <div
                className="w-full aspect-square rounded-2xl md:rounded-3xl flex items-center justify-center
                  overflow-hidden relative shadow-sm
                  group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300"
                style={!imgSrc ? { background: b?.bg ?? ic?.bg ?? '#18181b' } : undefined}
              >
                {imgSrc ? (
                  /* WP category photo */
                  <>
                    <Image
                      src={imgSrc}
                      alt={cat.name}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 640px) 25vw, (max-width: 768px) 20vw, (max-width: 1024px) 16vw, 12vw"
                    />
                    {/* subtle overlay for legibility */}
                    <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors duration-300" />
                  </>
                ) : b ? (
                  /* Brand monogram */
                  <span
                    className={`font-serif font-black leading-none tracking-tighter select-none ${
                      shortMono
                        ? 'text-2xl sm:text-3xl md:text-4xl'
                        : 'text-base sm:text-lg md:text-xl'
                    }`}
                    style={{ color: b.fg }}
                  >
                    {b.mono}
                  </span>
                ) : ic ? (
                  /* Generic icon */
                  <ic.Icon
                    className="w-[44%] h-[44%]"
                    style={{ color: ic.fg }}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                ) : (
                  <ShoppingBag className="w-[44%] h-[44%] text-white" strokeWidth={1.5} />
                )}
              </div>

              {/* Category name */}
              <p className="text-[10px] sm:text-[11px] md:text-xs font-semibold text-center uppercase
                tracking-wide text-brand-dark/60 leading-tight line-clamp-2 w-full">
                {cat.name}
              </p>
            </Link>
          );
        })}
      </div>

    </section>
  );
}
