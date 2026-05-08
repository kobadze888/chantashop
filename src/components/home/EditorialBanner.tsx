import Image from 'next/image';
import { Link } from '@/navigation';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { HomeCategory } from '@/lib/api';

const BRAND_SLUGS = new Set([
  'chanel', 'christian-dior', 'dolce-gabbana', 'fendi', 'gucci',
  'guess', 'luis-vuitton', 'michael-kors', 'prada', 'ysl',
]);

interface Tile {
  slug: string;
  label: string;
  title: string;
  desc: string;
  cta: string;
  img: string;
  tone: 'dark' | 'light';
}

interface Props {
  categories: HomeCategory[];
}

/* ─── Big banner card (Premium / Economy) ─────────────────────────── */
function BigBannerCard({ tile }: { tile: Tile }) {
  return (
    <Link
      href={{ pathname: '/product-category/[slug]', params: { slug: tile.slug } }}
      className="group relative aspect-[5/6] rounded-2xl md:rounded-3xl overflow-hidden block
        bg-zinc-100 shadow-md hover:shadow-2xl transition-all duration-500 h-full"
    >
      <Image
        src={tile.img}
        alt={tile.title}
        fill
        sizes="(max-width: 1024px) 100vw, 440px"
        className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
        quality={92}
      />

      {/* Bottom dark gradient */}
      <div className="absolute inset-x-0 bottom-0 h-3/5
        bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

      {/* Top label pill */}
      <span className="absolute top-3 left-3 md:top-4 md:left-4
        inline-flex items-center
        bg-white/95 backdrop-blur-sm text-brand-dark
        text-[9px] md:text-[10px] font-bold uppercase tracking-[0.18em]
        px-2.5 md:px-3 py-1 md:py-1.5 rounded-full shadow-lg">
        {tile.label}
      </span>

      {/* Bottom content */}
      <div className="absolute inset-x-0 bottom-0
        p-3 sm:p-4 md:p-5 lg:p-6 text-white">
        <h3 className="font-sans font-bold tracking-tight leading-[1.05]
          text-base sm:text-lg md:text-xl lg:text-[1.5rem]
          mb-1 md:mb-1.5 drop-shadow-md">
          {tile.title}
        </h3>
        <p className="hidden md:block
          text-[11px] lg:text-xs text-white/80 leading-relaxed
          mb-3 lg:mb-4 max-w-[220px]">
          {tile.desc}
        </p>
        <span className="inline-flex items-center gap-1.5 self-start
          bg-white text-brand-dark
          text-[10px] sm:text-xs md:text-sm font-bold
          px-3 sm:px-3.5 md:px-4
          py-1.5 sm:py-2 md:py-2.5
          rounded-full shadow-xl
          group-hover:bg-brand-DEFAULT group-hover:text-white group-hover:gap-2.5
          transition-all duration-300 mt-1.5">
          {tile.cta}
          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
        </span>
      </div>
    </Link>
  );
}

/* ─── Horizontal category strip card ───────────────────────────────── */
function CategoryStripCard({ cat }: { cat: HomeCategory }) {
  const img = cat.image?.sourceUrl ?? cat.products?.nodes?.[0]?.image?.sourceUrl;
  return (
    <Link
      href={{ pathname: '/product-category/[slug]', params: { slug: cat.slug } }}
      className="group relative flex items-center gap-3 md:gap-4
        p-2 md:p-3
        rounded-xl md:rounded-2xl
        bg-white border border-stone-200/80
        shadow-sm hover:shadow-lg hover:border-stone-300
        transition-all duration-300 h-full overflow-hidden"
    >
      <div className="relative aspect-square w-16 sm:w-20 md:w-24 lg:w-[6.5rem] shrink-0
        rounded-lg md:rounded-xl overflow-hidden bg-zinc-100">
        {img ? (
          <Image
            src={img}
            alt={cat.name}
            fill
            sizes="120px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-stone-100 to-stone-200" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm md:text-base font-bold text-brand-dark
          line-clamp-2 leading-tight
          group-hover:text-brand-DEFAULT transition-colors">
          {cat.name}
        </h4>
        <span className="text-[10px] md:text-xs text-gray-500 mt-1 inline-block">
          {cat.count} პროდუქტი
        </span>
      </div>

      <ArrowRight className="w-4 h-4 text-gray-400 shrink-0
        group-hover:text-brand-DEFAULT group-hover:translate-x-0.5 transition-all" />
    </Link>
  );
}

/* ─── Vertical strip — fills banner column height ──────────────────── */
function CategoryStrip({ cats }: { cats: HomeCategory[] }) {
  return (
    <div
      className="grid gap-3 md:gap-4 h-full"
      style={{ gridTemplateRows: `repeat(${cats.length}, minmax(0, 1fr))` }}
    >
      {cats.map(cat => <CategoryStripCard key={cat.slug} cat={cat} />)}
    </div>
  );
}

/* ─── Main section ─────────────────────────────────────────────────── */
export default function EditorialBanner({ categories }: Props) {
  const t = useTranslations('Home.Editorial');

  // Filter out brands and the two big-banner specials
  const otherCats = categories.filter(
    c => !BRAND_SLUGS.has(c.slug) && c.slug !== 'luqsi' && c.slug !== 'ekonomi'
  );

  const stripCats = otherCats.slice(0, 4);

  const premium: Tile = {
    slug: 'luqsi',
    label: t('luxuryLabel'),
    title: t('luxuryTitle'),
    desc: t('luxuryDesc'),
    cta: t('luxuryCta'),
    img: '/images/chantashop_ge_banner_premium.png',
    tone: 'dark',
  };

  const economy: Tile = {
    slug: 'ekonomi',
    label: t('economyLabel'),
    title: t('economyTitle'),
    desc: t('economyDesc'),
    cta: t('economyCta'),
    img: '/images/chantashop_ge_banner_econom.png',
    tone: 'light',
  };

  return (
    <section className="relative mt-12 md:mt-16 py-8 md:py-12
      bg-gradient-to-b from-rose-50/40 via-stone-50/30 to-white">

      {/* Decorative blurs */}
      <div className="absolute top-8 right-10 w-40 h-40 rounded-full bg-brand-DEFAULT/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-8 left-10 w-48 h-48 rounded-full bg-brand-dark/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-3 md:px-6 relative">
        <div className="max-w-5xl mx-auto space-y-3 md:space-y-5">

          {/* TOP ROW: Premium (left) + cats strip (right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
            <BigBannerCard tile={premium} />
            {stripCats.length > 0 && <CategoryStrip cats={stripCats} />}
          </div>

          {/* BOTTOM ROW: cats strip mirror (left) + Economy (right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
            {/* Mirror strip — visible only on md+ to avoid mobile duplication */}
            {stripCats.length > 0 && (
              <div className="hidden md:block">
                <CategoryStrip cats={stripCats} />
              </div>
            )}
            <BigBannerCard tile={economy} />
          </div>

        </div>
      </div>
    </section>
  );
}
