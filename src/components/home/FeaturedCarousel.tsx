'use client';

import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { Link } from '@/navigation';
import { Product } from '@/types';

interface FeaturedCarouselProps {
    title: string;
    subtitle: string;
    products: any[];
    locale: string;
}

export default function FeaturedCarousel({ title, subtitle, products, locale }: FeaturedCarouselProps) {
  return (
    <div className="container mx-auto px-4 mt-20 md:mt-32 mb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4">
            <div>
                <span className="text-brand-DEFAULT text-xs font-bold tracking-widest uppercase mb-2 block">{subtitle}</span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark">{title}</h2>
            </div>
            <Link href="/collection" className="px-8 py-3 rounded-full border border-gray-200 text-sm font-bold text-brand-dark hover:bg-brand-dark hover:text-white transition uppercase tracking-widest flex items-center gap-2 group">
                ყველას ნახვა <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>

        {/* Carousel Container */}
        <div className="flex gap-4 md:gap-6 overflow-x-auto hide-scrollbar pb-12 snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0">
            {products.map((product) => (
                <div key={product.id} className="snap-start flex-shrink-0">
                    <ProductCard 
                        {...product} 
                        locale={locale} 
                        // ეს კლასი უზრუნველყოფს ზუსტად იმ ზომებს რაც HTML-შია
                        className="min-w-[44vw] w-[44vw] md:min-w-[340px] md:w-[340px]" 
                    />
                </div>
            ))}
        </div>
    </div>
  );
}