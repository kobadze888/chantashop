import ProductCard from '../products/ProductCard';
import { useTranslations } from 'next-intl';

interface Props {
  products: any[];
  locale: string;
}

export default function BestSellers({ products, locale }: Props) {
  const t = useTranslations('Home.BestSellers');

  if (!products?.length) return null;

  return (
    <section className="container mx-auto px-3 md:px-6 mt-12 md:mt-16">
      <header className="mb-5 md:mb-7">
        <h2 className="text-lg md:text-xl font-semibold text-brand-dark">
          {t('title')}
        </h2>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
        {products.slice(0, 4).map((product, i) => (
          <div key={product.id} className="relative">
            <span className="absolute -top-2 -left-2 z-20 w-9 h-9 md:w-10 md:h-10 rounded-full bg-brand-dark text-white text-xs md:text-sm font-black flex items-center justify-center shadow-lg ring-2 ring-white">
              {t('rank', { rank: i + 1 })}
            </span>
            <ProductCard
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
          </div>
        ))}
      </div>
    </section>
  );
}
