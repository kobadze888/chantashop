import ProductCard from '../products/ProductCard';
import { Link } from '@/navigation';
import { ArrowRight, Flame } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Props {
  products: any[];
  locale: string;
}

export default function SaleSection({ products, locale }: Props) {
  const t = useTranslations('Home.Sale');

  if (!products?.length) return null;

  const visible = products.slice(0, 5);

  return (
    <section className="mt-12 md:mt-16 bg-gradient-to-br from-brand-light via-white to-brand-medium/40 py-12 md:py-20">
      <div className="container mx-auto px-3 md:px-6">
        <header className="flex items-center justify-between mb-5 md:mb-7">
          <div>
            <h2 className="inline-flex items-center gap-2 font-display text-xl md:text-2xl font-bold tracking-tight text-brand-dark">
              {t('title')} <Flame className="w-4 h-4 text-brand-DEFAULT" />
            </h2>
          </div>
          <Link
            href={{ pathname: '/product-category/[slug]', params: { slug: 'sale' } }}
            className="self-start md:self-end inline-flex items-center gap-2 text-sm font-bold text-brand-dark hover:text-brand-DEFAULT transition-colors"
          >
            {t('viewAll')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {visible.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              salePrice={product.salePrice}
              regularPrice={product.regularPrice}
              image={product.image}
              secondImage={product.secondImage}
              slug={product.slug}
              locale={locale}
              stockStatus={product.stockStatus}
              stockStatusManual={product.stockStatusManual}
              priority={false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
