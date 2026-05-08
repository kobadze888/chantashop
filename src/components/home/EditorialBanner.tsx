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
    },
    {
      slug: 'ekonomi',
      label: t('economyLabel'),
      title: t('economyTitle'),
      desc: t('economyDesc'),
      cta: t('economyCta'),
      img: '/images/chantashop_ge_banner_econom.png',
    },
  ];

  return (
    <section className="container mx-auto px-3 md:px-6 mt-10 md:mt-14">
      <div className="grid grid-cols-2 gap-3 md:gap-5">
        {tiles.map((tile) => (
          <Link
            key={tile.slug}
            href={{ pathname: '/product-category/[slug]', params: { slug: tile.slug } }}
            className="group relative aspect-[5/6] rounded-2xl md:rounded-[2rem] overflow-hidden block bg-zinc-100 shadow-sm hover:shadow-xl transition-shadow duration-500"
          >
            {/* Photo */}
            <Image
              src={tile.img}
              alt={tile.title}
              fill
              sizes="(max-width: 1024px) 50vw, 600px"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
            />

            {/* Bottom dark gradient — same for both cards (no more white wash) */}
            <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none" />

            {/* Top label badge */}
            <span className="absolute top-3 left-3 md:top-5 md:left-5
              inline-flex items-center
              bg-white/95 backdrop-blur-sm text-brand-dark
              text-[9px] md:text-[10px] font-bold uppercase tracking-[0.18em]
              px-2.5 md:px-3.5 py-1 md:py-1.5 rounded-full shadow-lg">
              {tile.label}
            </span>

            {/* Bottom content — title + desc + CTA */}
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-7 lg:p-9 text-white">
              <h3 className="font-sans font-bold tracking-tight leading-[1.1]
                text-base sm:text-xl md:text-2xl lg:text-[1.9rem]
                mb-1.5 md:mb-2.5
                drop-shadow-md">
                {tile.title}
              </h3>

              <p className="hidden sm:block
                text-xs md:text-sm
                text-white/85 leading-relaxed
                mb-4 md:mb-5
                max-w-[280px]">
                {tile.desc}
              </p>

              <span className="inline-flex items-center gap-1.5
                self-start
                bg-white text-brand-dark
                text-[11px] sm:text-xs md:text-sm font-bold
                px-3.5 sm:px-5 md:px-6
                py-1.5 sm:py-2.5 md:py-3
                rounded-full shadow-xl
                group-hover:bg-brand-DEFAULT group-hover:text-white group-hover:gap-2.5
                transition-all duration-300">
                {tile.cta}
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
