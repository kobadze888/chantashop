'use client';

import { useTranslations } from 'next-intl';
import ProductCard from './ProductCard';

interface Product {
    id: number;
    title: string;
    price: string;
    image: string;
    slug: string;
}

export default function ProductGrid({ products }: { products: Product[] }) {
  const t = useTranslations('ProductGrid');
  
  return (
    <section className="mt-6 px-4 pb-24 md:container md:mx-auto md:pb-10">
        <h3 className="font-bold text-mocha-dark mb-4 text-sm md:text-xl uppercase tracking-wider">{t('popular_title')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {products.map((product) => (
                <ProductCard 
                    key={product.id}
                    id={product.id}
                    slug={product.slug}
                    title={product.title}
                    price={product.price}
                    image={product.image}
                />
            ))}
        </div>
    </section>
  );
}