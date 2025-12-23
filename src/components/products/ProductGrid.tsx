'use client';

import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';

interface ProductGridProps {
  products: any[];
  loading?: boolean;
  locale: string;
}

export default function ProductGrid({ products, loading, locale }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
        {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
      {products.map((product, idx) => (
        <ProductCard
          key={product.id}
          id={product.databaseId}
          name={product.name}
          price={product.price}
          salePrice={product.salePrice}
          regularPrice={product.regularPrice}
          image={product.image?.sourceUrl}
          secondImage={product.galleryImages?.nodes[0]?.sourceUrl}
          slug={product.slug}
          locale={locale}
          attributes={product.attributes}
          stockStatus={product.stockStatus}
          stockStatusManual={product.stockStatusManual}
          stockQuantity={product.stockQuantity}
          shortDescription={product.shortDescription}
          description={product.description}
          productCategories={product.productCategories}
          priority={idx < 4} // ✅ პრიორიტეტი მხოლოდ პირველ ოთხზე
        />
      ))}
    </div>
  );
}