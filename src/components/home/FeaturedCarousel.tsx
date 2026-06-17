'use client';

import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import ProductCard from '../products/ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';

interface FeaturedCarouselProps {
  title: string;
  subtitle?: string;
  products: any[];
  locale: string;
}

export default function FeaturedCarousel({ title, subtitle, products, locale }: FeaturedCarouselProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          {subtitle && <p className="text-xs uppercase tracking-widest text-brand-DEFAULT font-bold mb-1">{subtitle}</p>}
          <h2 className="text-xl md:text-2xl font-serif font-bold text-brand-dark tracking-tight">{title}</h2>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => swiperRef.current?.slidePrev()} aria-label="Previous" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-brand-dark hover:text-white transition-all active:scale-90 cursor-pointer">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button type="button" onClick={() => swiperRef.current?.slideNext()} aria-label="Next" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-brand-dark hover:text-white transition-all active:scale-90 cursor-pointer">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <style>{`
        .fc-swiper .swiper-slide{ height:auto; }
      `}</style>
      <Swiper
        modules={[Autoplay]}
        spaceBetween={20}
        slidesPerView={2}
        onSwiper={(s) => { swiperRef.current = s; }}
        breakpoints={{
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 }
        }}
        className="fc-swiper pb-4"
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