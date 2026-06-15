'use client';

import Image from 'next/image';
import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
    ChevronUp, ChevronDown, X, ChevronLeft, ChevronRight,
    ZoomIn, ZoomOut, Maximize2
} from 'lucide-react';

interface ProductGalleryProps {
  mainImage: string;
  gallery: string[];
  alt: string;
}

const MIN_SWIPE = 40;

/* ── Fullscreen modal — top-level component (stable identity, no remount on navigate) ── */
function GalleryModal({
  images, index, alt, onClose, onNext, onPrev,
}: {
  images: string[]; index: number; alt: string;
  onClose: () => void; onNext: () => void; onPrev: () => void;
}) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const touchStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onNext();
      else if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [onClose, onNext, onPrev]);

  // reset zoom whenever the image changes
  useEffect(() => { setIsZoomed(false); setPos({ x: 0, y: 0 }); }, [index]);

  const toggleZoom = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setIsZoomed(z => { if (z) setPos({ x: 0, y: 0 }); return !z; });
  };

  return (
    <div
      className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-xl flex items-center justify-center animate-fade-in select-none"
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        className="absolute top-0 inset-x-0 h-16 md:h-20 flex items-center justify-between px-4 md:px-6 z-[100000] bg-gradient-to-b from-black/70 to-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-white/90 text-sm font-bold tracking-widest">{index + 1} / {images.length}</div>
        <div className="flex items-center gap-3">
          <button onClick={toggleZoom} className="p-2 text-white/80 hover:text-white bg-white/5 rounded-full grid place-items-center cursor-pointer">
            {isZoomed ? <ZoomOut className="w-6 h-6" /> : <ZoomIn className="w-6 h-6" />}
          </button>
          <button onClick={onClose} className="p-2 bg-white/15 text-white rounded-full hover:bg-white/25 transition-all grid place-items-center cursor-pointer">
            <X className="w-6 h-6 md:w-7 md:h-7" />
          </button>
        </div>
      </div>

      {/* Nav arrows */}
      {!isZoomed && images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-3 lg:left-10 top-1/2 -translate-y-1/2 w-11 h-11 lg:w-16 lg:h-16 bg-white/10 text-white rounded-full transition-all z-[100000] cursor-pointer grid place-items-center active:scale-90 hover:bg-white/20"
          >
            <ChevronLeft className="w-7 h-7 lg:w-10 lg:h-10" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-3 lg:right-10 top-1/2 -translate-y-1/2 w-11 h-11 lg:w-16 lg:h-16 bg-white/10 text-white rounded-full transition-all z-[100000] cursor-pointer grid place-items-center active:scale-90 hover:bg-white/20"
          >
            <ChevronRight className="w-7 h-7 lg:w-10 lg:h-10" />
          </button>
        </>
      )}

      {/* Image stage with swipe + zoom */}
      <div
        className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => { if (isZoomed) { setDragging(true); dragStart.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }; } }}
        onMouseMove={(e) => { if (dragging && isZoomed) setPos({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y }); }}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
        onTouchStart={(e) => {
          if (isZoomed) { setDragging(true); dragStart.current = { x: e.touches[0].clientX - pos.x, y: e.touches[0].clientY - pos.y }; }
          else touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }}
        onTouchMove={(e) => { if (dragging && isZoomed) setPos({ x: e.touches[0].clientX - dragStart.current.x, y: e.touches[0].clientY - dragStart.current.y }); }}
        onTouchEnd={(e) => {
          setDragging(false);
          if (!isZoomed) {
            const dx = e.changedTouches[0].clientX - touchStart.current.x;
            const dy = e.changedTouches[0].clientY - touchStart.current.y;
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > MIN_SWIPE) { if (dx > 0) onPrev(); else onNext(); }
          }
        }}
        onDoubleClick={toggleZoom}
      >
        <div
          className="relative w-full h-full transition-transform duration-300 ease-out"
          style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${isZoomed ? 2.5 : 1})` }}
        >
          <Image src={images[index]} alt={alt} fill className="object-contain pointer-events-none" sizes="100vw" priority quality={95} />
        </div>
      </div>
    </div>
  );
}

export default function ProductGallery({ mainImage, gallery, alt }: ProductGalleryProps) {
  const allImages = useMemo(
    () => [mainImage, ...gallery.filter((url) => url !== mainImage)].filter(Boolean),
    [mainImage, gallery]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const touchStart = useRef({ x: 0, y: 0 });
  const swipedRef = useRef(false);

  const handleNext = useCallback(() => setSelectedIndex((p) => (p + 1) % allImages.length), [allImages.length]);
  const handlePrev = useCallback(() => setSelectedIndex((p) => (p - 1 + allImages.length) % allImages.length), [allImages.length]);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      setCanScrollUp(scrollTop > 10);
      setCanScrollDown(scrollTop + clientHeight < scrollHeight - 15);
    }
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      setTimeout(checkScroll, 500);
    }
  }, [mainImage, checkScroll]);

  useEffect(() => { setMounted(true); setTimeout(checkScroll, 300); }, [checkScroll]);

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 h-full relative group/gallery select-none">

        {/* === THUMBNAILS === */}
        <div className="order-2 lg:order-1 relative lg:w-[100px] flex-shrink-0 group/thumbs">
          <button
            onClick={() => scrollRef.current?.scrollBy({ top: -200, behavior: 'smooth' })}
            className={`hidden lg:grid place-items-center absolute -top-8 left-1/2 -translate-x-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-xl border border-gray-100 text-brand-dark transition-all duration-300 hover:bg-brand-DEFAULT hover:text-white cursor-pointer ${canScrollUp ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <ChevronUp className="w-5 h-5" />
          </button>

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto hide-scrollbar w-full lg:h-[600px] snap-x lg:snap-y scroll-smooth p-1.5 flex-nowrap"
          >
            {allImages.map((url, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`relative flex-shrink-0 w-16 aspect-[4/5] lg:w-full rounded-lg overflow-hidden transition-all duration-300 snap-start cursor-pointer border-2 ${selectedIndex === index ? 'border-brand-DEFAULT shadow-md z-10' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <Image src={url} alt={`${alt} ${index + 1}`} fill className="object-cover" sizes="100px" />
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollRef.current?.scrollBy({ top: 200, behavior: 'smooth' })}
            className={`hidden lg:grid place-items-center absolute -bottom-8 left-1/2 -translate-x-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-xl border border-gray-100 text-brand-dark transition-all duration-300 hover:bg-brand-DEFAULT hover:text-white cursor-pointer ${canScrollDown ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* === MAIN IMAGE === */}
        <div
          className="order-1 lg:order-2 flex-1 relative w-full bg-gray-50 rounded-2xl lg:rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm aspect-[4/5] lg:h-[600px] cursor-zoom-in group/main touch-pan-y"
          onClick={() => { if (swipedRef.current) { swipedRef.current = false; return; } setIsModalOpen(true); }}
          onTouchStart={(e) => { swipedRef.current = false; touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - touchStart.current.x;
            const dy = e.changedTouches[0].clientY - touchStart.current.y;
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > MIN_SWIPE) { swipedRef.current = true; if (dx > 0) handlePrev(); else handleNext(); }
          }}
        >
          <Image src={allImages[selectedIndex] || '/placeholder.jpg'} alt={alt} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 800px" />
          <div className="absolute inset-0 bg-black/0 group-hover/main:bg-black/5 transition-colors grid place-items-center">
            <Maximize2 className="w-10 h-10 text-white opacity-0 group-hover/main:opacity-100 transition-all duration-300 drop-shadow-2xl" />
          </div>
          {allImages.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-full md:hidden shadow-lg border border-white/10">
              {selectedIndex + 1} / {allImages.length}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && mounted && createPortal(
        <GalleryModal
          images={allImages}
          index={selectedIndex}
          alt={alt}
          onClose={closeModal}
          onNext={handleNext}
          onPrev={handlePrev}
        />,
        document.body
      )}
    </>
  );
}
