import Image from 'next/image';
import { Link } from '@/navigation';
import {
  ArrowRight, ShoppingBag, Briefcase, Watch, Glasses,
  Umbrella, Wallet, Sparkles, Luggage, Gem, type LucideIcon,
} from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import type { HomeCategory } from '@/lib/api';
import { getCategoryName } from '@/lib/categoryTranslations';

const BRAND_SLUGS = new Set([
  'chanel', 'christian-dior', 'dolce-gabbana', 'fendi', 'gucci',
  'guess', 'lacoste', 'luis-vuitton', 'michael-kors', 'prada',
  'versace', 'ysl',
]);

const FEATURED = {
  luqsi:   { img: '/images/chantashop_ge_banner_premium.png', ribbon: 'PREMIUM' },
  ekonomi: { img: '/images/chantashop_ge_banner_econom.png',  ribbon: 'ECONOMY' },
} as const;

/* ── Generated visuals: gradient + icon per category (no image needed) ── */
const GRADIENT_PALETTE = [
  'from-rose-400 via-pink-500 to-fuchsia-600',
  'from-amber-400 via-orange-500 to-rose-500',
  'from-sky-400 via-blue-500 to-indigo-600',
  'from-emerald-400 via-teal-500 to-cyan-600',
  'from-violet-500 via-purple-500 to-indigo-600',
  'from-stone-500 via-stone-700 to-zinc-900',
  'from-pink-400 via-rose-500 to-red-500',
  'from-teal-400 via-emerald-500 to-green-600',
];

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  qalis_chantebi:               ShoppingBag,
  'naturaluri-tyavis-chantebi': Briefcase,
  kolgebi:                      Umbrella,
  saatebi:                      Watch,
  satvaleebi:                   Glasses,
  'samgzavro-chantebi':         Luggage,
  sapuleebi:                    Wallet,
  sunamo:                       Sparkles,
};

/* Deterministic hash → stable gradient per slug */
function slugHash(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h;
}

function gradientFor(slug: string): string {
  return GRADIENT_PALETTE[slugHash(slug) % GRADIENT_PALETTE.length];
}

function iconFor(slug: string): LucideIcon {
  return CATEGORY_ICONS[slug] ?? Gem;
}

interface CardData {
  slug: string;
  name: string;
  count?: number;
  img?: string;
  ribbon?: string;
}

/* ─── Featured card — Luxury / Economy (aspect 5:6 matches banner photos) ── */
function FeaturedCard({ card }: { card: CardData }) {
  const t = useTranslations('Home.Editorial');
  return (
    <Link
      href={{ pathname: '/product-category/[slug]', params: { slug: card.slug } }}
      className="group relative aspect-[5/6] md:aspect-[20/19]
        rounded-2xl md:rounded-3xl overflow-hidden block
        bg-stone-100
        shadow-sm hover:shadow-2xl
        ring-1 ring-black/5 hover:ring-black/10
        transition-all duration-500"
    >
      {card.img && (
        <Image
          src={card.img}
          alt={card.name}
          fill
          sizes="(max-width: 1024px) 50vw, 50vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          quality={92}
          priority
        />
      )}

      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-2/5
        bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

      {/* Ribbon */}
      {card.ribbon && (
        <span className="absolute top-3 left-3 md:top-5 md:left-5
          inline-flex items-center
          bg-white/95 backdrop-blur-sm text-brand-dark
          text-[9px] md:text-[11px] font-bold uppercase tracking-[0.22em]
          px-2.5 md:px-3.5 py-1 md:py-1.5 rounded-full shadow-md">
          {card.ribbon}
        </span>
      )}

      {/* Bottom content */}
      <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 lg:p-6 text-white">
        <h3 className="font-sans font-bold tracking-tight leading-tight
          text-lg sm:text-xl md:text-2xl lg:text-3xl
          mb-1.5 drop-shadow-md">
          {card.name}
        </h3>
        <div className="flex items-center justify-between gap-3">
          {card.count !== undefined && card.count > 0 && (
            <span className="text-xs md:text-sm text-white/85">
              {t('products', { count: card.count })}
            </span>
          )}
          <span className="ml-auto inline-flex items-center gap-1.5 text-xs md:text-sm font-medium
            text-white/90 group-hover:text-white
            group-hover:translate-x-1 transition-transform duration-300">
            {t('view')}
            <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ─── Small uniform category card — image-only, aspect-square ──────── */
function SmallCard({ card }: { card: CardData }) {
  const t = useTranslations('Home.Editorial');
  const isEmpty = !card.count;
  const img = card.img;
  const Icon = iconFor(card.slug);

  return (
    <Link
      href={{ pathname: '/product-category/[slug]', params: { slug: card.slug } }}
      style={{ aspectRatio: '1 / 1' }}
      className="group relative
        rounded-xl md:rounded-2xl overflow-hidden block
        bg-stone-100
        shadow-sm hover:shadow-xl
        ring-1 ring-black/5 hover:ring-black/10
        transition-all duration-500"
    >
      {img ? (
        <Image
          src={img}
          alt={card.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.08]"
          quality={85}
        />
      ) : (
        /* ── Generated visual — colourful gradient + category icon ── */
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientFor(card.slug)}`}>
          {/* soft decorative glows */}
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/20 blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-black/10 blur-2xl" />
          {/* watermark icon */}
          <Icon
            className="absolute inset-0 m-auto w-2/5 h-2/5 text-white/90
              drop-shadow-lg transition-transform duration-700 ease-out
              group-hover:scale-110 group-hover:rotate-3"
            strokeWidth={1.5}
          />
        </div>
      )}

      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-2/3
        bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

      {/* "Coming soon" badge for empty categories */}
      {isEmpty && (
        <span className="absolute top-2 right-2
          inline-flex items-center
          bg-white/90 backdrop-blur-sm text-brand-dark/80
          text-[8px] md:text-[9px] font-semibold uppercase tracking-wider
          px-2 py-0.5 rounded-full shadow-sm">
          {t('comingSoon')}
        </span>
      )}

      {/* Bottom content */}
      <div className="absolute inset-x-0 bottom-0 p-2.5 md:p-3 text-white">
        <h3 className="font-sans font-semibold tracking-tight leading-tight
          text-xs sm:text-sm md:text-[13px] lg:text-sm
          line-clamp-2 drop-shadow-md">
          {card.name}
        </h3>
        {!isEmpty && (
          <span className="text-[10px] md:text-[11px] text-white/75 inline-block mt-0.5">
            {t('products', { count: card.count! })}
          </span>
        )}
      </div>
    </Link>
  );
}

/* ─── Main section ─────────────────────────────────────────────────── */
interface Props {
  categories: HomeCategory[];
}

export default function EditorialBanner({ categories }: Props) {
  const t = useTranslations('Home.Editorial');
  const locale = useLocale();
  const productCats = categories.filter(c => !BRAND_SLUGS.has(c.slug));

  const luqsi   = productCats.find(c => c.slug === 'luqsi');
  const ekonomi = productCats.find(c => c.slug === 'ekonomi');
  const others  = productCats.filter(c => c.slug !== 'luqsi' && c.slug !== 'ekonomi');

  const toCard = (c: HomeCategory): CardData => ({
    slug:  c.slug,
    name:  getCategoryName(c.slug, c.name, locale),
    count: c.count ?? 0,
    img:   c.image?.sourceUrl ?? c.products?.nodes?.[0]?.image?.sourceUrl,
  });

  // Sort: ones with products first, then empty
  const smalls = [...others].sort((a, b) => (b.count ?? 0) - (a.count ?? 0)).map(toCard);

  return (
    <section className="relative mt-12 md:mt-20 py-10 md:py-16
      bg-gradient-to-b from-rose-50/40 via-stone-50/30 to-white">

      {/* Decorative blobs */}
      <div className="absolute top-12 right-10 w-40 h-40 rounded-full bg-brand-DEFAULT/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 left-10 w-48 h-48 rounded-full bg-brand-dark/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-3 md:px-6 relative">

        {/* Section header */}
        <header className="flex items-end justify-between mb-6 md:mb-10">
          <div>
            <span className="block text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] text-brand-DEFAULT/80 mb-2">
              {t('sectionLabel')}
            </span>
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-brand-dark">
              {t('sectionTitle')}
            </h2>
          </div>
          <Link
            href={{ pathname: '/shop' }}
            className="hidden sm:inline-flex items-center gap-1.5
              text-sm font-medium text-brand-dark/70 hover:text-brand-dark
              transition-colors group"
          >
            {t('viewAllCategories')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </header>

        {/* Top row — LUQSI + EKONOMI side by side */}
        <div className="grid grid-cols-2 gap-3 md:gap-5 mb-3 md:mb-5">
          {luqsi && (
            <FeaturedCard card={{
              ...toCard(luqsi),
              img:    FEATURED.luqsi.img,
              ribbon: FEATURED.luqsi.ribbon,
            }} />
          )}
          {ekonomi && (
            <FeaturedCard card={{
              ...toCard(ekonomi),
              img:    FEATURED.ekonomi.img,
              ribbon: FEATURED.ekonomi.ribbon,
            }} />
          )}
        </div>

        {/* Bottom grid — 8 small categories: 2 cols mobile, 4 cols desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {smalls.map(card => <SmallCard key={card.slug} card={card} />)}
        </div>

        {/* Mobile-only "view all" */}
        <div className="sm:hidden mt-6 text-center">
          <Link
            href={{ pathname: '/shop' }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
              bg-brand-dark text-white text-sm font-medium
              hover:bg-brand-DEFAULT transition-colors"
          >
            {t('viewAllCategories')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
