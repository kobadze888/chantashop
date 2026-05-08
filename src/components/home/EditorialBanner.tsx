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

/* Semantic Unsplash fallbacks for categories that have no image yet in WP */
const FALLBACK_IMAGES: Record<string, string> = {
  qalis_chantebi:               'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=800&auto=format&fit=crop',
  'naturaluri-tyavis-chantebi': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
  kolgebi:                      'https://images.unsplash.com/photo-1601379329542-31c59ba1716b?q=80&w=800&auto=format&fit=crop',
  saatebi:                      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800&auto=format&fit=crop',
  satvaleebi:                   'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop',
  'samgzavro-chantebi':         'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
  sapuleebi:                    'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop',
  sunamo:                       'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop',
};

interface CardData {
  slug: string;
  name: string;
  count?: number;
  img?: string;
  ribbon?: string;
}

/* ─── Featured card — Luxury / Economy (aspect 5:6 matches banner photos) ── */
function FeaturedCard({ card }: { card: CardData }) {
  return (
    <Link
      href={{ pathname: '/product-category/[slug]', params: { slug: card.slug } }}
      className="group relative aspect-[5/6]
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
              {card.count} პროდუქტი
            </span>
          )}
          <span className="ml-auto inline-flex items-center gap-1.5 text-xs md:text-sm font-medium
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

/* ─── Small uniform category card — image-only, aspect-square ──────── */
function SmallCard({ card }: { card: CardData }) {
  const isEmpty = !card.count;
  const img = card.img ?? FALLBACK_IMAGES[card.slug];

  return (
    <Link
      href={{ pathname: '/product-category/[slug]', params: { slug: card.slug } }}
      className="group relative aspect-square
        rounded-xl md:rounded-2xl overflow-hidden block
        bg-stone-100
        shadow-sm hover:shadow-xl
        ring-1 ring-black/5 hover:ring-black/10
        transition-all duration-500"
    >
      {img && (
        <Image
          src={img}
          alt={card.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.08]"
          quality={85}
        />
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

        {/* Top row — LUQSI + EKONOMI side by side, aspect 5:6 matches banners */}
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
            ყველა კატეგორია
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
