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
    <section className="container mx-auto px-3 md:px-6 mt-10 md:mt-14">
      <div className="grid grid-cols-2 gap-3 md:gap-5">
        {tiles.map((tile) => (
          <Link
            key={tile.slug}
            href={{ pathname: '/product-category/[slug]', params: { slug: tile.slug } }}
            className="group relative aspect-[3/4] sm:aspect-[4/5] md:aspect-[4/5] lg:aspect-[16/11] rounded-2xl md:rounded-[2rem] overflow-hidden block"
          >
            <Image
              src={tile.img}
              alt={tile.title}
              fill
              sizes="(max-width: 768px) 50vw, 50vw"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div
              className={`absolute inset-0 ${
                tile.tone === 'dark'
                  ? 'bg-gradient-to-t from-black/85 via-black/25 to-transparent'
                  : 'bg-gradient-to-t from-white/90 via-white/20 to-transparent'
              }`}
            />
            <div
              className={`absolute inset-0 p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-end ${
                tile.tone === 'dark' ? 'text-white' : 'text-brand-dark'
              }`}
            >
              <h3 className="text-base sm:text-xl md:text-2xl lg:text-[2rem] font-sans font-bold tracking-tight leading-[1.1] mb-1.5 md:mb-2">
                {tile.title}
              </h3>
              <p className={`hidden sm:block text-xs md:text-sm mb-4 md:mb-5 max-w-xs ${tile.tone === 'dark' ? 'text-white/75' : 'text-brand-dark/65'}`}>
                {tile.desc}
              </p>
              <span
                className={`inline-flex items-center gap-1.5 self-start text-[11px] sm:text-xs md:text-sm font-bold px-3 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all group-hover:gap-2.5 ${
                  tile.tone === 'dark'
                    ? 'bg-white text-brand-dark group-hover:bg-brand-DEFAULT group-hover:text-white'
                    : 'bg-brand-dark text-white group-hover:bg-brand-DEFAULT'
                }`}
              >
                {tile.cta}
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
