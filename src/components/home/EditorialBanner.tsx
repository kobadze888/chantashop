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
      img: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1400&auto=format&fit=crop',
      tone: 'dark' as const,
    },
    {
      slug: 'ekonomi',
      label: t('economyLabel'),
      title: t('economyTitle'),
      desc: t('economyDesc'),
      cta: t('economyCta'),
      img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1400&auto=format&fit=crop',
      tone: 'light' as const,
    },
  ];

  return (
    <section className="container mx-auto px-3 md:px-6 mt-12 md:mt-16">
      <div className="grid md:grid-cols-2 gap-3 md:gap-5">
        {tiles.map((tile) => (
          <Link
            key={tile.slug}
            href={{ pathname: '/product-category/[slug]', params: { slug: tile.slug } }}
            className="group relative aspect-[4/5] md:aspect-[5/4] rounded-2xl md:rounded-[2rem] overflow-hidden block"
          >
            <Image
              src={tile.img}
              alt={tile.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div
              className={`absolute inset-0 ${
                tile.tone === 'dark'
                  ? 'bg-gradient-to-t from-black/85 via-black/30 to-transparent'
                  : 'bg-gradient-to-t from-white/95 via-white/30 to-transparent'
              }`}
            />
            <div
              className={`absolute inset-0 p-7 md:p-12 flex flex-col justify-end ${
                tile.tone === 'dark' ? 'text-white' : 'text-brand-dark'
              }`}
            >
              <span
                className="text-[10px] font-medium uppercase tracking-[0.15em] text-brand-DEFAULT mb-2 md:mb-3 block"
              >
                {tile.label}
              </span>
              <h3 className="text-2xl md:text-[2.2rem] font-sans font-bold tracking-tight leading-[1.1] mb-2 md:mb-3">
                {tile.title}
              </h3>
              <p className={`text-sm md:text-base mb-5 md:mb-7 max-w-xs ${tile.tone === 'dark' ? 'text-white/80' : 'text-brand-dark/70'}`}>
                {tile.desc}
              </p>
              <span
                className={`inline-flex items-center gap-2 self-start text-sm font-bold px-6 py-3 rounded-full transition-all group-hover:gap-3 ${
                  tile.tone === 'dark'
                    ? 'bg-white text-brand-dark group-hover:bg-brand-DEFAULT group-hover:text-white'
                    : 'bg-brand-dark text-white group-hover:bg-brand-DEFAULT'
                }`}
              >
                {tile.cta}
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
