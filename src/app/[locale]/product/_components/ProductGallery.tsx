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
  const [active, setActive] = useState(startIndex);
  const touchStart = useRef({ x: 0, y: 0 });

  const next = useCallback(() => setActive((a) => (a + 1) % images.length), [images.length]);
  const prev = useCallback(() => setActive((a) => (a - 1 + images.length) % images.length), [images.length]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [next, prev, onClose]);

  return (
    <div
      className="fixed inset-0 z-[99999] bg-neutral-950 flex flex-col animate-fade-in"
      onClick={onClose}
    >
      {/* ── Top bar: counter + clean close ── */}
      <div
        className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-white/60 text-xs font-semibold tracking-[0.2em] tabular-nums">
          {images.length > 1 ? `${String(active + 1).padStart(2, '0')} / ${String(images.length).padStart(2, '0')}` : ''}
        </span>
        <button
          onClick={onClose}
          aria-label="Close"
          className="w-9 h-9 grid place-items-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" strokeWidth={1.75} />
        </button>
      </div>

      {/* ── Image stage (fills space, swipeable) ── */}
      <div
        className="relative flex-1 min-h-0 flex items-center justify-center px-3 md:px-16"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => { touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - touchStart.current.x;
          const dy = e.changedTouches[0].clientY - touchStart.current.y;
          if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) { if (dx > 0) prev(); else next(); }
        }}
      >
        <Image
          key={active}
          src={images[active]}
          alt={`${alt} ${active + 1}`}
          fill
          className="object-contain animate-fade-in select-none"
          sizes="100vw"
          quality={95}
          priority
        />

        {/* Arrows (desktop) — subtle, no heavy chrome */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous"
              className="hidden md:grid place-items-center absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition cursor-pointer active:scale-90"
            >
              <ChevronLeft className="w-7 h-7" strokeWidth={1.5} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next"
              className="hidden md:grid place-items-center absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition cursor-pointer active:scale-90"
            >
              <ChevronRight className="w-7 h-7" strokeWidth={1.5} />
            </button>
          </>
        )}
      </div>

      {/* ── Bottom thumbnail strip ── */}
      {images.length > 1 && (
        <div
          className="shrink-0 pt-2 pb-[calc(14px+env(safe-area-inset-bottom))] px-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex gap-2 justify-center overflow-x-auto hide-scrollbar">
            {images.map((url, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Photo ${i + 1}`}
                className={`relative w-11 h-14 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 cursor-pointer ${active === i ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : 'opacity-45 hover:opacity-90'}`}
              >
                <Image src={url} alt="" fill className="object-cover" sizes="44px" />
              </button>
            ))}
          </div>
        </div>
      )}
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
      <div className="flex flex-col lg:flex-row gap-2.5 lg:gap-4 select-none">

        {/* === THUMBNAILS — horizontal row below (mobile), vertical left (desktop) === */}
        <div className="order-2 lg:order-1 lg:w-[84px] flex-shrink-0">
          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto hide-scrollbar lg:max-h-[560px]">
            {allImages.map((url, i) => (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                className={`relative flex-shrink-0 w-16 lg:w-full aspect-[4/5] rounded-lg lg:rounded-xl overflow-hidden transition-all duration-200 cursor-pointer border-2 ${active === i ? 'border-brand-DEFAULT shadow-md' : 'border-transparent opacity-55 hover:opacity-100'}`}
                aria-label={`Photo ${i + 1}`}
              >
                <Image src={url} alt={`${alt} ${i + 1}`} fill className="object-cover" sizes="84px" />
              </button>
            ))}
          </div>
        </div>

        {/* === MAIN SLIDER (full-width on mobile; native scroll-snap: swipe flips, tap opens lightbox) === */}
        <div className="order-1 lg:order-2 flex-1 relative min-w-0">
          <div
            ref={trackRef}
            onScroll={onTrackScroll}
            className="flex w-full overflow-x-auto snap-x snap-mandatory hide-scrollbar overscroll-x-contain rounded-2xl lg:rounded-[2rem] border border-gray-100 shadow-sm bg-gray-50"
          >
            {allImages.map((url, i) => (
              <div
                key={i}
                onClick={() => setLightboxOpen(true)}
                className="group/main relative w-full shrink-0 snap-center h-[54vh] sm:h-[60vh] lg:h-[560px] cursor-zoom-in"
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

          {/* Counter (thumbnails already indicate position, so no dots) */}
          {allImages.length > 1 && (
            <div className="lg:hidden absolute top-3 right-3 bg-black/55 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full z-10 tabular-nums">
              {active + 1} / {allImages.length}
            </div>
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
