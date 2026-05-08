import Image from 'next/image';
import { Link } from '@/navigation';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function EditorialBanner() {
  const t = useTranslations('Home.Editorial');

  const tiles = [
    {
      slug: 'luqsi',
      label: t('luxuryLabel'),
      title: t('luxuryTitle'),
      desc: t('luxuryDesc'),
      cta: t('luxuryCta'),
      img: '/images/chantashop_ge_banner_premium.png',
      tone: 'dark' as const,
    },
    {
      slug: 'ekonomi',
      label: t('economyLabel'),
      title: t('economyTitle'),
      desc: t('economyDesc'),
      cta: t('economyCta'),
      img: '/images/chantashop_ge_banner_econom.png',
      tone: 'light' as const,
    },
  ];

  return (
    <section className="relative mt-12 md:mt-16 py-10 md:py-16
      bg-gradient-to-b from-rose-50/40 via-stone-50/30 to-white">

      {/* Subtle decorative dots — top right */}
      <div className="absolute top-6 right-6 w-32 h-32 rounded-full bg-brand-DEFAULT/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-6 left-6 w-40 h-40 rounded-full bg-brand-dark/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-3 md:px-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {tiles.map((tile) => {
            const isDark = tile.tone === 'dark';
            return (
              <Link
                key={tile.slug}
                href={{ pathname: '/product-category/[slug]', params: { slug: tile.slug } }}
                className={`group relative overflow-hidden
                  rounded-2xl md:rounded-3xl
                  ${isDark
                    ? 'bg-gradient-to-br from-zinc-900 via-zinc-800 to-black text-white'
                    : 'bg-gradient-to-br from-white via-stone-50 to-stone-100 text-brand-dark border border-stone-200/70'}
                  shadow-md hover:shadow-2xl
                  transition-all duration-500
                  aspect-[5/3]`}
              >
                <div className="grid grid-cols-2 h-full">

                  {/* Photo column — 50% width × full height = 5:6 (exact match for source) */}
                  <div className="relative h-full overflow-hidden">
                    <Image
                      src={tile.img}
                      alt={tile.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
                      quality={90}
                    />
                  </div>

                  {/* Content column */}
                  <div className="flex flex-col justify-between p-4 sm:p-5 md:p-6 lg:p-8">

                    <div>
                      {/* Top label badge */}
                      <span className={`inline-flex items-center
                        ${isDark
                          ? 'bg-white/10 border-white/20 text-white/95'
                          : 'bg-brand-dark/5 border-brand-dark/15 text-brand-dark/80'}
                        border backdrop-blur-sm
                        text-[9px] md:text-[10px] font-bold uppercase tracking-[0.18em]
                        px-2.5 md:px-3 py-1 rounded-full
                        mb-2.5 md:mb-4`}>
                        {tile.label}
                      </span>

                      {/* Title */}
                      <h3 className="font-sans font-bold tracking-tight leading-[1.05]
                        text-base sm:text-lg md:text-xl lg:text-[1.65rem] xl:text-[1.9rem]
                        mb-1.5 md:mb-2.5">
                        {tile.title}
                      </h3>

                      {/* Description — hidden on mobile/sm for compactness */}
                      <p className={`hidden md:block
                        text-xs lg:text-[13px] leading-relaxed
                        ${isDark ? 'text-white/65' : 'text-brand-dark/60'}
                        max-w-[260px]`}>
                        {tile.desc}
                      </p>
                    </div>

                    {/* CTA */}
                    <span className={`inline-flex items-center gap-1.5
                      self-start
                      ${isDark
                        ? 'bg-white text-brand-dark'
                        : 'bg-brand-dark text-white'}
                      text-[10px] sm:text-xs md:text-sm font-bold
                      px-3 sm:px-4 md:px-5
                      py-1.5 sm:py-2 md:py-2.5
                      rounded-full shadow-md
                      group-hover:bg-brand-DEFAULT group-hover:text-white group-hover:gap-2.5
                      transition-all duration-300
                      mt-2`}>
                      {tile.cta}
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
