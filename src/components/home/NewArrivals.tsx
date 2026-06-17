'use client';

import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import ProductCard from '../products/ProductCard';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import 'swiper/css';
import 'swiper/css/pagination';

interface Props {
  products: any[];
  locale: string;
}

export default function NewArrivals({ products, locale }: Props) {
  const t = useTranslations('Home.NewArrivals');
  const tCommon = useTranslations('Common');
  const swiperRef = useRef<SwiperType | null>(null);

  if (!products?.length) return null;

  return (
    <section className="relative overflow-hidden mt-12 md:mt-16 py-10 md:py-14 bg-gradient-to-br from-rose-50 via-pink-50/50 to-white">
      <style>{`
        .na-swiper .swiper-slide{ height:auto; }
        .na-swiper .swiper-pagination{ position:static !important; margin-top:22px; }
        .na-swiper .swiper-pagination-bullet{ width:8px; height:8px; background:#e5b9cf; opacity:1; transition:all .3s; margin:0 4px !important; }
        .na-swiper .swiper-pagination-bullet-active{ background:#db2777; width:22px; border-radius:9999px; }
      `}</style>

      {/* Decorative glows */}
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-brand-DEFAULT/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 left-0 w-56 h-56 rounded-full bg-brand-dark/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-3 md:px-6 relative">
        <header className="flex items-end justify-between mb-6 md:mb-8">
          <div>
            <span className="block text-[10px] md:text-xs font-bold uppercase tracking-[0.22em] text-brand-DEFAULT/80 mb-1.5">
              {t('subtitle')}
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-brand-dark">
              {t('title')}
            </h2>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Link
              href="/shop"
              className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-brand-dark hover:text-brand-DEFAULT transition-colors mr-2"
            >
              {tCommon('viewAll')}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous"
              className="w-10 h-10 rounded-full bg-white/80 backdrop-blur border border-gray-200 flex items-center justify-center hover:bg-brand-dark hover:border-brand-dark hover:text-white transition-all active:scale-90 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Next"
              className="w-10 h-10 rounded-full bg-white/80 backdrop-blur border border-gray-200 flex items-center justify-center hover:bg-brand-dark hover:border-brand-dark hover:text-white transition-all active:scale-90 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </header>

        <Swiper
          modules={[Pagination]}
          spaceBetween={12}
          slidesPerView={2}
          onSwiper={(s) => { swiperRef.current = s; }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 3, spaceBetween: 14 },
            1024: { slidesPerView: 4, spaceBetween: 16 },
            1280: { slidesPerView: 5, spaceBetween: 16 },
          }}
          className="na-swiper"
        >
          {products.slice(0, 12).map((product) => (
            <SwiperSlide key={product.id}>
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
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="md:hidden mt-6 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-dark hover:text-brand-DEFAULT transition-colors"
          >
            {tCommon('viewAll')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
