'use client';

import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
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
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  if (!products?.length) return null;

  return (
    <section className="relative overflow-hidden mt-12 md:mt-16 py-10 md:py-14 bg-gradient-to-br from-rose-50 via-pink-50/50 to-white">
      <style>{`
        .na-swiper .swiper-pagination{ position:static; margin-top:22px; }
        .na-swiper .swiper-pagination-bullet{ width:7px; height:7px; background:#e5b9cf; opacity:1; transition:all .3s; }
        .na-swiper .swiper-pagination-bullet-active{ background:#db2777; }
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
              ref={prevRef}
              aria-label="Previous"
              className="w-10 h-10 rounded-full bg-white/80 backdrop-blur border border-gray-200 flex items-center justify-center hover:bg-brand-dark hover:border-brand-dark hover:text-white transition-all active:scale-90 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              ref={nextRef}
              aria-label="Next"
              className="w-10 h-10 rounded-full bg-white/80 backdrop-blur border border-gray-200 flex items-center justify-center hover:bg-brand-dark hover:border-brand-dark hover:text-white transition-all active:scale-90 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </header>

        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={12}
          slidesPerView={2}
          navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
          pagination={{ clickable: true, dynamicBullets: true }}
          onBeforeInit={(swiper) => {
            // @ts-expect-error swiper navigation refs assigned post-init
            swiper.params.navigation.prevEl = prevRef.current;
            // @ts-expect-error swiper navigation refs assigned post-init
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          breakpoints={{
            640: { slidesPerView: 3, spaceBetween: 14 },
            1024: { slidesPerView: 4, spaceBetween: 16 },
            1280: { slidesPerView: 5, spaceBetween: 16 },
          }}
          className="na-swiper pb-1"
        >
          {products.map((product) => (
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
