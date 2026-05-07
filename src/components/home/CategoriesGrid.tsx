'use client';
import Image from 'next/image';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import type { HomeCategory } from '@/lib/api';

interface Props {
  categories: HomeCategory[];
  fallbackImages?: Record<string, string>;
}

/* ── Fallback colours when WP has no photo ── */
const FALLBACK: Record<string, { initial: string; bg: string; fg: string }> = {
  'chanel':                     { initial: 'C',  bg: '#0a0a0a', fg: '#fff' },
  'christian-dior':             { initial: 'D',  bg: '#111',    fg: '#fff' },
  'dolce-gabbana':              { initial: 'D&G',bg: '#1c1c1c', fg: '#D4AF37' },
  'fendi':                      { initial: 'F',  bg: '#F5E6C8', fg: '#3D2B1F' },
  'gucci':                      { initial: 'G',  bg: '#1B4332', fg: '#D4AF37' },
  'guess':                      { initial: 'GU', bg: '#111',    fg: '#fff' },
  'luis-vuitton':               { initial: 'LV', bg: '#5C3317', fg: '#D4AF37' },
  'michael-kors':               { initial: 'MK', bg: '#1a1a1a', fg: '#C9A96E' },
  'prada':                      { initial: 'P',  bg: '#000',    fg: '#fff' },
  'ysl':                        { initial: 'YSL',bg: '#0a0a0a', fg: '#D4AF37' },
  'luqsi':                      { initial: 'L',  bg: '#1a0a2e', fg: '#fff' },
  'ekonomi':                    { initial: 'E',  bg: '#064e3b', fg: '#fff' },
  'qalis_chantebi':             { initial: 'Q',  bg: '#4c1d95', fg: '#fff' },
  'naturaluri-tyavis-chantebi': { initial: 'N',  bg: '#78350f', fg: '#fff' },
  'kolgebi':                    { initial: 'K',  bg: '#0c4a6e', fg: '#fff' },
};

export default function CategoriesGrid({ categories }: Props) {
  const t = useTranslations('Home.Categories');

  return (
    <section className="mt-10 md:mt-14">
      {/* hide scrollbar cross-browser */}
      <style>{`.cats-scroll{scrollbar-width:none}.cats-scroll::-webkit-scrollbar{display:none}`}</style>

      <div className="container mx-auto px-3 md:px-6">
        <header className="mb-5 md:mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-brand-dark">
            {t('title')}
          </h2>
        </header>
      </div>

      {/*
        Mobile  → single scrollable row (overflow-x-auto)
        Desktop → flex-wrap, left-aligned, auto-flow
      */}
      <div className="cats-scroll px-3 md:px-6 md:container md:mx-auto overflow-x-auto md:overflow-visible">
        <div className="flex flex-nowrap gap-3 md:gap-4 md:flex-wrap pb-1 md:pb-0">
          {categories.map((cat) => {
            const imgSrc = cat.image?.sourceUrl;
            const fb = FALLBACK[cat.slug];
            const bg  = fb?.bg  ?? '#18181b';
            const fg  = fb?.fg  ?? '#fff';
            const ini = fb?.initial ?? cat.name.slice(0, 2).toUpperCase();

            return (
              <Link
                key={cat.id}
                href={{ pathname: '/product-category/[slug]', params: { slug: cat.slug } }}
                className="group flex-none flex flex-col items-center gap-1.5"
                style={{ width: '68px' }}
              >
                {/* ── Circle ── */}
                <div
                  className="w-[68px] h-[68px] md:w-[72px] md:h-[72px] rounded-full overflow-hidden relative flex-shrink-0 ring-[2.5px] ring-gray-100 group-hover:ring-brand-DEFAULT transition-all duration-200 group-hover:scale-105"
                  style={!imgSrc ? { background: bg } : undefined}
                >
                  {imgSrc ? (
                    <Image
                      src={imgSrc}
                      alt={cat.name}
                      fill
                      className="object-cover object-center"
                      sizes="72px"
                    />
                  ) : (
                    <span
                      className="absolute inset-0 flex items-center justify-center font-bold select-none"
                      style={{
                        color: fg,
                        fontSize: ini.length <= 2 ? '1.1rem' : '0.75rem',
                        letterSpacing: '0.03em',
                      }}
                    >
                      {ini}
                    </span>
                  )}
                </div>

                {/* ── Name ── */}
                <span className="text-[10px] md:text-[11px] font-medium text-gray-600 text-center leading-snug line-clamp-2 w-full">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
