'use client';
import Image from 'next/image';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import type { HomeCategory } from '@/lib/api';

interface Props {
  categories: HomeCategory[];
  fallbackImages?: Record<string, string>; // kept for API compat, unused
}

/* ── Fallback brand configs (used when WP has no photo) ── */
const BRAND: Record<string, { name: string; bg: string; fg: string }> = {
  'chanel':          { name: 'Chanel',  bg: '#000000', fg: '#FFFFFF' },
  'christian-dior':  { name: 'Dior',    bg: '#0D0D0D', fg: '#FFFFFF' },
  'dolce-gabbana':   { name: 'D&G',     bg: '#1C1C1C', fg: '#D4AF37' },
  'fendi':           { name: 'Fendi',   bg: '#F5E6C8', fg: '#3D2B1F' },
  'gucci':           { name: 'Gucci',   bg: '#1B4332', fg: '#D4AF37' },
  'guess':           { name: 'Guess',   bg: '#111111', fg: '#FFFFFF' },
  'luis-vuitton':    { name: 'LV',      bg: '#5C3317', fg: '#D4AF37' },
  'michael-kors':    { name: 'MK',      bg: '#1a1a1a', fg: '#C9A96E' },
  'prada':           { name: 'Prada',   bg: '#000000', fg: '#FFFFFF' },
  'ysl':             { name: 'YSL',     bg: '#0A0A0A', fg: '#D4AF37' },
};

const CATEGORY: Record<string, { bg: string; fg: string }> = {
  'luqsi':                      { bg: '#1a0a2e', fg: '#FFFFFF' },
  'ekonomi':                    { bg: '#064e3b', fg: '#FFFFFF' },
  'qalis_chantebi':             { bg: '#4c1d95', fg: '#FFFFFF' },
  'naturaluri-tyavis-chantebi': { bg: '#78350f', fg: '#FFFFFF' },
  'kolgebi':                    { bg: '#0c4a6e', fg: '#FFFFFF' },
};

/**
 * Find the column count (6–8) that divides `total` most evenly.
 * Prefers 7 → 6 → 8 when checking for exact fit, otherwise picks
 * the count with fewest leftover cards in the last row.
 */
function bestCols(total: number): number {
  for (const c of [7, 6, 8, 5]) {
    if (total % c === 0) return c;
  }
  let best = 7;
  let bestRem = total;
  for (let c = 5; c <= 8; c++) {
    const rem = total % c;
    if (rem < bestRem) { bestRem = rem; best = c; }
  }
  return best;
}

export default function CategoriesGrid({ categories }: Props) {
  const t = useTranslations('Home.Categories');
  const mdCols = bestCols(categories.length);

  return (
    <section className="container mx-auto px-3 md:px-6 mt-10 md:mt-14">
      {/* Responsive grid: 4 cols mobile, computed equal-row cols on md+ */}
      <style>{`@media(min-width:768px){.cats-grid{grid-template-columns:repeat(${mdCols},minmax(0,1fr))}}`}</style>

      <header className="mb-5 md:mb-7">
        <h2 className="text-lg md:text-xl font-semibold text-brand-dark">
          {t('title')}
        </h2>
      </header>

      <div className="cats-grid grid grid-cols-5 gap-x-2 gap-y-3 md:gap-x-3 md:gap-y-5">
        {categories.map((cat) => {
          const imgSrc = cat.image?.sourceUrl;
          const b = BRAND[cat.slug];
          const c = CATEGORY[cat.slug];
          const bgColor = b?.bg ?? c?.bg ?? '#18181b';
          const fgColor = b?.fg ?? c?.fg ?? '#FFFFFF';
          const label   = b?.name ?? cat.name;

          return (
            <Link
              key={cat.id}
              href={{ pathname: '/product-category/[slug]', params: { slug: cat.slug } }}
              className="group flex flex-col items-center"
            >
              {/* ── Square card ── */}
              <div
                className="w-full aspect-square rounded-xl md:rounded-2xl overflow-hidden relative shadow-sm group-hover:shadow-md group-hover:-translate-y-0.5 transition-all duration-300"
                style={!imgSrc ? { background: bgColor } : undefined}
              >
                {imgSrc ? (
                  /* WP photo */
                  <Image
                    src={imgSrc}
                    alt={cat.name}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 25vw, (max-width: 768px) 20vw, 14vw"
                  />
                ) : (
                  /* Colored fallback — brand letter(s) centred */
                  <div className="absolute inset-0 flex items-center justify-center p-2">
                    <span
                      className="font-bold text-center leading-tight select-none"
                      style={{
                        color: fgColor,
                        fontSize:
                          label.length <= 3 ? 'clamp(1.1rem,4vw,1.6rem)' :
                          label.length <= 6 ? 'clamp(0.8rem,3vw,1.1rem)' :
                                              'clamp(0.6rem,2.2vw,0.85rem)',
                      }}
                    >
                      {label}
                    </span>
                  </div>
                )}
              </div>

              {/* ── Name below card ── */}
              <p className="mt-1.5 text-[10px] md:text-[11px] font-medium text-gray-600 text-center leading-tight line-clamp-2 w-full px-0.5">
                {cat.name}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
