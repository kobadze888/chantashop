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
    <section className="relative mt-12 md:mt-16 py-8 md:py-12
      bg-gradient-to-b from-rose-50/40 via-stone-50/30 to-white">

      {/* Decorative blurs */}
      <div className="absolute top-8 right-10 w-40 h-40 rounded-full bg-brand-DEFAULT/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-8 left-10 w-48 h-48 rounded-full bg-brand-dark/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-3 md:px-6 relative">
        {/* Narrower than container — keeps cards compact */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 gap-3 md:gap-5">
            {tiles.map((tile) => (
              <Link
                key={tile.slug}
                href={{ pathname: '/product-category/[slug]', params: { slug: tile.slug } }}
                className="group relative
                  aspect-[5/6]
                  rounded-2xl md:rounded-3xl overflow-hidden
                  block bg-zinc-100
                  shadow-md hover:shadow-2xl transition-all duration-500"
              >
                {/* Photo — fills card, exact 5:6 match (no cropping) */}
                <Image
                  src={tile.img}
                  alt={tile.title}
                  fill
                  sizes="(max-width: 1024px) 50vw, 440px"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
                  quality={92}
                />

                {/* Bottom dark gradient — text readability without overpowering photo */}
                <div className="absolute inset-x-0 bottom-0 h-3/5
                  bg-gradient-to-t from-black/90 via-black/40 to-transparent
                  pointer-events-none" />

                {/* Top-left label pill */}
                <span className="absolute top-3 left-3 md:top-4 md:left-4
                  inline-flex items-center
                  bg-white/95 backdrop-blur-sm text-brand-dark
                  text-[9px] md:text-[10px] font-bold uppercase tracking-[0.18em]
                  px-2.5 md:px-3 py-1 md:py-1.5 rounded-full shadow-lg">
                  {tile.label}
                </span>

                {/* Bottom content — title + (description) + CTA */}
                <div className="absolute inset-x-0 bottom-0
                  p-3 sm:p-4 md:p-5 lg:p-6
                  text-white">
                  <h3 className="font-sans font-bold tracking-tight leading-[1.05]
                    text-base sm:text-lg md:text-xl lg:text-[1.55rem]
                    mb-1 md:mb-1.5
                    drop-shadow-md">
                    {tile.title}
                  </h3>

                  <p className="hidden md:block
                    text-[11px] lg:text-xs
                    text-white/80 leading-relaxed
                    mb-3 lg:mb-4
                    max-w-[220px]">
                    {tile.desc}
                  </p>

                  <span className="inline-flex items-center gap-1.5
                    self-start
                    bg-white text-brand-dark
                    text-[10px] sm:text-xs md:text-sm font-bold
                    px-3 sm:px-3.5 md:px-4
                    py-1.5 sm:py-2 md:py-2.5
                    rounded-full shadow-xl
                    group-hover:bg-brand-DEFAULT group-hover:text-white group-hover:gap-2.5
                    transition-all duration-300
                    mt-1.5">
                    {tile.cta}
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
