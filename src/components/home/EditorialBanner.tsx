import Image from 'next/image';
import { Link } from '@/navigation';
import { ArrowRight } from 'lucide-react';
import type { HomeCategory } from '@/lib/api';

const BRAND_SLUGS = new Set([
  'chanel', 'christian-dior', 'dolce-gabbana', 'fendi', 'gucci',
  'guess', 'lacoste', 'luis-vuitton', 'michael-kors', 'prada',
  'versace', 'ysl',
]);

const FEATURED = {
  luqsi:   { img: '/images/chantashop_ge_banner_premium.png', ribbon: 'PREMIUM' },
  ekonomi: { img: '/images/chantashop_ge_banner_econom.png',  ribbon: 'ECONOMY' },
} as const;

interface CardData {
  slug: string;
  name: string;
  count?: number;
  img?: string;
  ribbon?: string;
  featured?: boolean;
}

/* ─── Featured (large) card — Luxury / Economy ─────────────────────── */
function FeaturedCard({ card, className = '' }: { card: CardData; className?: string }) {
  return (
    <Link
      href={{ pathname: '/product-category/[slug]', params: { slug: card.slug } }}
      className={`group relative h-full w-full
        rounded-2xl md:rounded-3xl overflow-hidden block
        bg-stone-100
        shadow-sm hover:shadow-2xl
        ring-1 ring-black/5 hover:ring-black/10
        transition-all duration-500 ${className}`}
    >
      {card.img && (
        <Image
          src={card.img}
          alt={card.name}
          fill
          sizes="(max-width: 640px) 50vw, 50vw"
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          quality={92}
          priority
        />
      )}

      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-2/5
        bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

      {/* Ribbon */}
      {card.ribbon && (
        <span className="absolute top-3 left-3 md:top-4 md:left-4
          inline-flex items-center
          bg-white/95 backdrop-blur-sm text-brand-dark
          text-[9px] md:text-[10px] font-bold uppercase tracking-[0.22em]
          px-2.5 md:px-3 py-1 md:py-1.5 rounded-full shadow-md">
          {card.ribbon}
        </span>
      )}

      {/* Bottom content */}
      <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 lg:p-5 text-white">
        <h3 className="font-sans font-bold tracking-tight leading-tight
          text-base sm:text-lg md:text-xl lg:text-2xl
          mb-1 drop-shadow-md">
          {card.name}
        </h3>
        <div className="flex items-center justify-between gap-3">
          {card.count !== undefined && card.count > 0 && (
            <span className="text-[11px] md:text-sm text-white/85">
              {card.count} პროდუქტი
            </span>
          )}
          <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] md:text-sm font-medium
            text-white/90 group-hover:text-white
            group-hover:translate-x-1 transition-transform duration-300">
            ნახვა
            <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ─── Small uniform category card ──────────────────────────────────── */
function SmallCard({ card }: { card: CardData }) {
  const isEmpty = !card.count;

  return (
    <Link
      href={{ pathname: '/product-category/[slug]', params: { slug: card.slug } }}
      className="group relative h-full w-full aspect-square
        rounded-xl md:rounded-2xl overflow-hidden block
        bg-gradient-to-br from-stone-100 to-stone-200
        shadow-sm hover:shadow-xl
        ring-1 ring-black/5 hover:ring-black/10
        transition-all duration-500"
    >
      {card.img ? (
        <Image
          src={card.img}
          alt={card.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.08]"
          quality={85}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center
          bg-gradient-to-br from-brand-DEFAULT/10 via-stone-100 to-brand-dark/10">
          <span className="text-3xl md:text-4xl font-serif text-brand-dark/30 select-none">
            {card.name.charAt(0)}
          </span>
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
          მალე
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
            {card.count} პროდუქტი
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
  const productCats = categories.filter(c => !BRAND_SLUGS.has(c.slug));

  const luqsi   = productCats.find(c => c.slug === 'luqsi');
  const ekonomi = productCats.find(c => c.slug === 'ekonomi');
  const others  = productCats.filter(c => c.slug !== 'luqsi' && c.slug !== 'ekonomi');

  const toCard = (c: HomeCategory): CardData => ({
    slug:  c.slug,
    name:  c.name,
    count: c.count ?? 0,
    img:   c.image?.sourceUrl ?? c.products?.nodes?.[0]?.image?.sourceUrl,
  });

  // Sort small cards: ones with products first, then empty ones
  const smalls = [...others].sort((a, b) => (b.count ?? 0) - (a.count ?? 0)).map(toCard);

  // Split into halves so each block (LUQSI / EKONOMI) gets equal smalls beside it
  const half = Math.ceil(smalls.length / 2);
  const firstHalf  = smalls.slice(0, half);
  const secondHalf = smalls.slice(half);

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
              COLLECTION
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-brand-dark">
              კატეგორიები
            </h2>
          </div>
          <Link
            href={{ pathname: '/shop' }}
            className="hidden sm:inline-flex items-center gap-1.5
              text-sm font-medium text-brand-dark/70 hover:text-brand-dark
              transition-colors group"
          >
            ყველა კატეგორია
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </header>

        {/*
          Bento-style grid (mockup-driven)
          Mobile  (2 cols): LUQSI cs2 rs2 → 4 smalls 2x2 → 4 smalls 2x2 → EKONOMI cs2 rs2
          Desktop (4 cols): LUQSI top-left (cs2 rs2)
                            + 4 smalls top-right (2x2 area)
                            + 4 smalls bottom-left (2x2 area)
                            + EKONOMI bottom-right (cs2 rs2)
        */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4">
          {luqsi && (
            <FeaturedCard
              className="col-span-2 row-span-2"
              card={{
                ...toCard(luqsi),
                img:    FEATURED.luqsi.img,
                ribbon: FEATURED.luqsi.ribbon,
                featured: true,
              }}
            />
          )}

          {/* First 4 smalls — top-right of LUQSI on desktop */}
          {firstHalf.map(card => <SmallCard key={card.slug} card={card} />)}

          {/* Next 4 smalls — bottom-left on desktop */}
          {secondHalf.map(card => <SmallCard key={card.slug} card={card} />)}

          {ekonomi && (
            <FeaturedCard
              className="col-span-2 row-span-2 md:col-start-3"
              card={{
                ...toCard(ekonomi),
                img:    FEATURED.ekonomi.img,
                ribbon: FEATURED.ekonomi.ribbon,
                featured: true,
              }}
            />
          )}
        </div>

        {/* Mobile-only "view all" */}
        <div className="sm:hidden mt-6 text-center">
          <Link
            href={{ pathname: '/shop' }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
              bg-brand-dark text-white text-sm font-medium
              hover:bg-brand-DEFAULT transition-colors"
          >
            ყველა კატეგორია
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
