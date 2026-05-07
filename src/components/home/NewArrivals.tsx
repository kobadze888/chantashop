'use client';

import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import ProductCard from '../products/ProductCard';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import 'swiper/css';

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
    <section className="container mx-auto px-3 md:px-6 mt-12 md:mt-16">
      <header className="flex items-end justify-between mb-7 md:mb-10">
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-brand-DEFAULT font-medium mb-1.5">
            {t('subtitle')}
          </p>
          <h2 className="text-xl md:text-[1.75rem] font-sans font-semibold text-brand-dark tracking-tight leading-snug">
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
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-brand-dark hover:border-brand-dark hover:text-white transition-all active:scale-90"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            ref={nextRef}
            aria-label="Next"
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-brand-dark hover:border-brand-dark hover:text-white transition-all active:scale-90"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </header>

      <Swiper
        modules={[Navigation]}
        spaceBetween={12}
        slidesPerView={2}
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        onBeforeInit={(swiper) => {
          // @ts-expect-error swiper navigation refs assigned post-init
          swiper.params.navigation.prevEl = prevRef.current;
          // @ts-expect-error swiper navigation refs assigned post-init
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        breakpoints={{
          640: { slidesPerView: 3, spaceBetween: 16 },
          1024: { slidesPerView: 4, spaceBetween: 20 },
        }}
        className="pb-2"
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

      <div className="md:hidden mt-5 text-center">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm font-bold text-brand-dark hover:text-brand-DEFAULT transition-colors"
        >
          {tCommon('viewAll')}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
