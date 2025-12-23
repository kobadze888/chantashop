'use client';

import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import ProductCard from '../products/ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';

interface FeaturedCarouselProps {
  title: string;
  products: any[];
  locale: string;
}

export default function FeaturedCarousel({ title, products, locale }: FeaturedCarouselProps) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl md:text-2xl font-serif font-bold text-brand-dark tracking-tight">{title}</h2>
        <div className="flex gap-2">
          <button ref={prevRef} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-brand-dark hover:text-white transition-all active:scale-90">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button ref={nextRef} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-brand-dark hover:text-white transition-all active:scale-90">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={2}
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        onBeforeInit={(swiper) => {
          // @ts-ignore
          swiper.params.navigation.prevEl = prevRef.current;
          // @ts-ignore
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        breakpoints={{
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 }
        }}
        className="pb-4"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard
              id={product.id || product.databaseId}
              name={product.name}
              price={product.price}
              salePrice={product.salePrice}
              regularPrice={product.regularPrice}
              image={product.image}
              slug={product.slug}
              locale={locale}
              stockStatus={product.stockStatus}
              stockStatusManual={product.stockStatusManual}
              priority={false} // ✅ კარუსელში Preload არ გვჭირდება
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}