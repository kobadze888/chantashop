import Image from 'next/image';
import { Link } from '@/navigation';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { HomeCategory } from '@/lib/api';

interface Props {
  categories: HomeCategory[];
  fallbackImages: Record<string, string>;
}

export default function CategoriesGrid({ categories, fallbackImages }: Props) {
  const t = useTranslations('Home.Categories');

  const visible = categories.slice(0, 8);

  return (
    <section className="container mx-auto px-3 md:px-6 mt-16 md:mt-24">
      <header className="flex items-end justify-between mb-7 md:mb-10">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-brand-DEFAULT font-bold mb-2">
            {t('subtitle')}
          </p>
          <h2 className="text-2xl md:text-4xl font-serif font-black text-brand-dark tracking-tight">
            {t('title')}
          </h2>
        </div>
        <Link
          href="/shop"
          className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-brand-dark hover:text-brand-DEFAULT transition-colors"
        >
          {t('viewAll')}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </header>

      <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
        {visible.map((cat) => {
          const img = cat.image?.sourceUrl || fallbackImages[cat.slug] || fallbackImages.default;
          return (
            <li key={cat.id}>
              <Link
                href={{ pathname: '/product-category/[slug]', params: { slug: cat.slug } }}
                className="group block aspect-[3/4] relative rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200"
              >
                <Image
                  src={img}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end text-white">
                  <h3 className="text-base md:text-xl font-serif font-bold leading-tight tracking-tight">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] md:text-xs text-white/80 mt-1 uppercase tracking-widest">
                    {t('products', { count: cat.count })}
                  </p>
                </div>
                <span className="absolute top-3 right-3 md:top-4 md:right-4 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                  <ArrowRight className="w-4 h-4 text-brand-dark" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Mobile View All */}
      <div className="md:hidden mt-5 text-center">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm font-bold text-brand-dark hover:text-brand-DEFAULT transition-colors"
        >
          {t('viewAll')}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
