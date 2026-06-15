'use client';

import Image from 'next/image';
import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface ProductGalleryProps {
  mainImage: string;
  gallery: string[];
  alt: string;
}

/* ── Compact, dimmed lightbox (centered, not full-bleed) ── */
function Lightbox({
  images, startIndex, alt, onClose,
}: {
  images: string[]; startIndex: number; alt: string; onClose: () => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(startIndex);

  const goTo = useCallback((i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const idx = (i + images.length) % images.length;
    el.scrollTo({ left: idx * el.clientWidth, behavior: 'smooth' });
  }, [images.length]);

  // start at the clicked image + lock body scroll + keyboard nav
  useEffect(() => {
    const el = trackRef.current;
    if (el) el.scrollTo({ left: startIndex * el.clientWidth });
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') goTo(active + 1);
      else if (e.key === 'ArrowLeft') goTo(active - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, goTo, onClose]);

  const onScroll = () => {
    const el = trackRef.current;
    if (el) setActive(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <div
      className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-fade-in"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-6 md:right-6 z-[100001] w-11 h-11 grid place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[100001] text-white/80 text-sm font-bold tracking-widest">
          {active + 1} / {images.length}
        </div>
      )}

      {/* Arrows (desktop) */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); goTo(active - 1); }}
            className="hidden md:grid place-items-center absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-[100001] w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 transition cursor-pointer active:scale-90"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goTo(active + 1); }}
            className="hidden md:grid place-items-center absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-[100001] w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 transition cursor-pointer active:scale-90"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </>
      )}

      {/* Compact image stage — swipeable via native scroll-snap */}
      <div
        ref={trackRef}
        onScroll={onScroll}
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-3xl h-[78vh] overflow-x-auto snap-x snap-mandatory hide-scrollbar overscroll-contain rounded-2xl"
      >
        {images.map((url, i) => (
          <div key={i} className="relative w-full h-full shrink-0 snap-center">
            <Image src={url} alt={`${alt} ${i + 1}`} fill className="object-contain" sizes="(max-width: 768px) 92vw, 768px" quality={95} priority={i === startIndex} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProductGallery({ mainImage, gallery, alt }: ProductGalleryProps) {
  const allImages = useMemo(
    () => [mainImage, ...gallery.filter((url) => url !== mainImage)].filter(Boolean),
    [mainImage, gallery]
  );

  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // reset when product changes
  useEffect(() => {
    setActive(0);
    if (trackRef.current) trackRef.current.scrollTo({ left: 0 });
  }, [mainImage]);

  const scrollToIndex = useCallback((i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const idx = (i + allImages.length) % allImages.length;
    el.scrollTo({ left: idx * el.clientWidth, behavior: 'smooth' });
  }, [allImages.length]);

  const onTrackScroll = () => {
    const el = trackRef.current;
    if (el) setActive(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 select-none">

        {/* === THUMBNAILS === */}
        <div className="order-2 lg:order-1 lg:w-[84px] flex-shrink-0">
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto hide-scrollbar lg:max-h-[560px]">
            {allImages.map((url, i) => (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                className={`relative flex-shrink-0 w-14 lg:w-full aspect-[4/5] rounded-lg overflow-hidden transition-all duration-200 cursor-pointer border-2 ${active === i ? 'border-brand-DEFAULT shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                aria-label={`Photo ${i + 1}`}
              >
                <Image src={url} alt={`${alt} ${i + 1}`} fill className="object-cover" sizes="84px" />
              </button>
            ))}
          </div>
        </div>

        {/* === MAIN SLIDER (native scroll-snap: swipe flips, tap opens lightbox) === */}
        <div className="order-1 lg:order-2 flex-1 relative">
          <div
            ref={trackRef}
            onScroll={onTrackScroll}
            className="flex w-full overflow-x-auto snap-x snap-mandatory hide-scrollbar overscroll-x-contain rounded-2xl lg:rounded-[2rem] border border-gray-100 shadow-sm bg-gray-50"
          >
            {allImages.map((url, i) => (
              <div
                key={i}
                onClick={() => setLightboxOpen(true)}
                className="group/main relative w-full shrink-0 snap-center h-[56vh] sm:h-[62vh] lg:h-[560px] cursor-zoom-in"
              >
                <Image
                  src={url || '/placeholder.jpg'}
                  alt={`${alt} ${i + 1}`}
                  fill
                  className="object-cover"
                  priority={i === 0}
                  sizes="(max-width: 1024px) 100vw, 760px"
                />
                <div className="absolute inset-0 bg-black/0 group-hover/main:bg-black/5 transition-colors grid place-items-center">
                  <Maximize2 className="w-9 h-9 text-white opacity-0 group-hover/main:opacity-100 transition-all duration-300 drop-shadow-2xl" />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={() => scrollToIndex(active - 1)}
                className="hidden lg:grid place-items-center absolute left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/90 backdrop-blur shadow-lg border border-gray-100 text-brand-dark hover:bg-brand-DEFAULT hover:text-white transition cursor-pointer active:scale-90"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollToIndex(active + 1)}
                className="hidden lg:grid place-items-center absolute right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/90 backdrop-blur shadow-lg border border-gray-100 text-brand-dark hover:bg-brand-DEFAULT hover:text-white transition cursor-pointer active:scale-90"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Mobile dots + counter */}
          {allImages.length > 1 && (
            <>
              <div className="lg:hidden absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {allImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${active === i ? 'w-5 bg-white' : 'w-1.5 bg-white/50'}`}
                    aria-label={`Go to photo ${i + 1}`}
                  />
                ))}
              </div>
              <div className="lg:hidden absolute top-3 right-3 bg-black/55 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full z-10">
                {active + 1} / {allImages.length}
              </div>
            </>
          )}
        </div>
      </div>

      {lightboxOpen && mounted && createPortal(
        <Lightbox images={allImages} startIndex={active} alt={alt} onClose={() => setLightboxOpen(false)} />,
        document.body
      )}
    </>
  );
}
