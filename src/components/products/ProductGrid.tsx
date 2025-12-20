import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import { Product } from '@/types';

interface ProductGridProps {
  products?: Product[];
  locale: string;
  isLoading?: boolean;
  skeletonCount?: number;
}

export default function ProductGrid({ 
  products = [], 
  locale, 
  isLoading = false, 
  skeletonCount = 9 
}: ProductGridProps) {
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {isLoading ? (
            Array.from({ length: skeletonCount }).map((_, index) => (
                <ProductCardSkeleton key={`skeleton-${index}`} />
            ))
        ) : (
            products.map((product, index) => (
                <ProductCard 
                    key={product.id}
                    id={product.databaseId}
                    name={product.name}
                    price={product.price}
                    salePrice={product.salePrice}
                    regularPrice={product.regularPrice}
                    image={product.image.sourceUrl}
                    secondImage={product.galleryImages?.nodes?.[0]?.sourceUrl}
                    slug={product.slug}
                    locale={locale}
                    attributes={product.attributes}
                    stockQuantity={product.stockQuantity}
                    stockStatus={product.stockStatus}
                    index={index}
                />
            ))
        )}
    </div>
  );
}