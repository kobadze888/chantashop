'use client';
import Image from 'next/image';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import type { HomeCategory } from '@/lib/api';

interface Props {
  categories: HomeCategory[];
  fallbackImages?: Record<string, string>;
}

/* ── Brand card configs — colored bg + display name ── */
const BRAND: Record<string, { name: string; bg: string; fg: string; size?: 'sm' | 'md' | 'lg' }> = {
  'chanel':          { name: 'Chanel',          bg: '#000000', fg: '#FFFFFF' },
  'christian-dior':  { name: 'Dior',            bg: '#0D0D0D', fg: '#FFFFFF' },
  'dolce-gabbana':   { name: 'D&G',             bg: '#1C1C1C', fg: '#D4AF37' },
  'fendi':           { name: 'Fendi',           bg: '#F5E6C8', fg: '#3D2B1F' },
  'gucci':           { name: 'Gucci',           bg: '#1B4332', fg: '#D4AF37' },
  'guess':           { name: 'Guess',           bg: '#111111', fg: '#FFFFFF' },
  'luis-vuitton':    { name: 'LV',              bg: '#5C3317', fg: '#D4AF37' },
  'michael-kors':    { name: 'MK',              bg: '#1a1a1a', fg: '#C9A96E' },
  'prada':           { name: 'Prada',           bg: '#000000', fg: '#FFFFFF' },
  'ysl':             { name: 'YSL',             bg: '#0A0A0A', fg: '#D4AF37' },
};

/* ── Generic category configs ── */
const CATEGORY: Record<string, { bg: string; fg: string }> = {
  'luqsi':                       { bg: '#1a0a2e', fg: '#FFFFFF' },
  'ekonomi':                     { bg: '#064e3b', fg: '#FFFFFF' },
  'qalis_chantebi':              { bg: '#4c1d95', fg: '#FFFFFF' },
  'naturaluri-tyavis-chantebi':  { bg: '#78350f', fg: '#FFFFFF' },
  'kolgebi':                     { bg: '#0c4a6e', fg: '#FFFFFF' },
};

export default function CategoriesGrid({ categories }: Props) {
  const t = useTranslations('Home.Categories');

  return (
    <section className="container mx-auto px-3 md:px-6 mt-10 md:mt-14">

      {/* Header — storex.ge სტილი: ერთი სუფთა სათაური */}
      <header className="flex items-center justify-between mb-6 md:mb-8">
        <h2 className="text-lg md:text-xl font-semibold text-brand-dark">
          {t('title')}
        </h2>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2.5 md:gap-3">
        {categories.map((cat) => {
          const imgSrc = cat.image?.sourceUrl;
          const b = BRAND[cat.slug];
          const c = CATEGORY[cat.slug];
          const bgColor = b?.bg ?? c?.bg ?? '#18181b';
          const fgColor = b?.fg ?? c?.fg ?? '#FFFFFF';
          const displayName = b?.name ?? cat.name;

          return (
            <Link
              key={cat.id}
              href={{ pathname: '/product-category/[slug]', params: { slug: cat.slug } }}
              className="group"
            >
              {/* Square card — name or photo inside, nothing below */}
              <div
                className="w-full aspect-square rounded-2xl md:rounded-3xl overflow-hidden relative
                  shadow-sm group-hover:shadow-lg group-hover:-translate-y-0.5
                  transition-all duration-300 flex items-end"
                style={!imgSrc ? { background: bgColor } : undefined}
              >
                {imgSrc ? (
                  /* WP category photo + name overlay at bottom */
                  <>
                    <Image
                      src={imgSrc}
                      alt={cat.name}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 640px) 25vw, (max-width: 768px) 20vw, 13vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <span className="relative z-10 w-full px-2 pb-2 text-white text-[10px] sm:text-[11px] font-semibold leading-tight line-clamp-2">
                      {cat.name}
                    </span>
                  </>
                ) : (
                  /* Colored card — name as main element */
                  <div className="absolute inset-0 flex items-center justify-center p-2">
                    <span
                      className="font-bold text-center leading-tight select-none"
                      style={{
                        color: fgColor,
                        fontSize: displayName.length <= 4
                          ? 'clamp(1.1rem, 4vw, 1.6rem)'
                          : displayName.length <= 7
                          ? 'clamp(0.8rem, 3vw, 1.15rem)'
                          : 'clamp(0.65rem, 2.2vw, 0.9rem)',
                      }}
                    >
                      {displayName}
                    </span>
                  </div>
                )}
              </div>
              {/* NO text below — nothing */}
            </Link>
          );
        })}
      </div>

    </section>
  );
}
