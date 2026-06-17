import ProductCard from '../products/ProductCard';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { ArrowRight } from 'lucide-react';

interface Props {
  products: any[];
  locale: string;
}

export default function BestSellers({ products, locale }: Props) {
  const t = useTranslations('Home.BestSellers');
  const tCommon = useTranslations('Common');

  if (!products?.length) return null;

  return (
    <section className="container mx-auto px-3 md:px-6 mt-12 md:mt-16">
      <header className="flex items-center justify-between mb-5 md:mb-7">
        <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight text-brand-dark">
          {t('title')}
        </h2>
        <Link
          href={{ pathname: '/product-category/[slug]', params: { slug: 'bestsellers' } }}
          className="inline-flex items-center gap-2 text-sm font-bold text-brand-dark hover:text-brand-DEFAULT transition-colors"
        >
          {tCommon('viewAll')}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {products.slice(0, 5).map((product, i) => (
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
            productCategories={product.productCategories}
            attributes={product.attributes}
            rank={i + 1}
            priority={false}
          />
        ))}
      </div>
    </section>
  );
}
