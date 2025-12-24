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

export default function ProductGallery({ mainImage, gallery, alt }: ProductGalleryProps) {
  const allImages = useMemo(() => {
      return [mainImage, ...gallery.filter(url => url !== mainImage)].filter(Boolean);
  }, [mainImage, gallery]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  // --- Swipe Logic (ჰორიზონტალური სვაიპის დეტექცია) ---
  const touchStartPos = useRef({ x: 0, y: 0 });
  const minSwipeDistance = 40;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartPos.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    };
  };

  const handleTouchEnd = (e: React.TouchEvent, onLeft: () => void, onRight: () => void) => {
    const deltaX = e.changedTouches[0].clientX - touchStartPos.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartPos.current.y;

    // ვამოწმებთ, რომ მოძრაობა იყო უფრო მეტად ჰორიზონტალური, ვიდრე ვერტიკალური
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) onRight(); // Swipe Right -> Previous Image
      else onLeft(); // Swipe Left -> Next Image
    }
  };

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

  useEffect(() => { 
    setMounted(true);
    setTimeout(checkScroll, 300);
  }, [checkScroll]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  // --- Modal Content ---
  const ModalContent = () => {
    const [isZoomed, setIsZoomed] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });

    useEffect(() => {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }, []);

    const toggleZoom = (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      if (isZoomed) setPosition({ x: 0, y: 0 });
      setIsZoomed(!isZoomed);
    };

    return (
      <div className="fixed inset-0 z-[99999] bg-black/98 backdrop-blur-2xl flex items-center justify-center animate-fade-in select-none">
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 h-20 flex items-center justify-between px-6 z-[100000] bg-gradient-to-b from-black/70 to-transparent">
              <div className="text-white/90 text-sm font-bold tracking-widest">{selectedIndex + 1} / {allImages.length}</div>
              <div className="flex items-center gap-4">
                  <button onClick={toggleZoom} className="p-2 text-white/80 hover:text-white transition-all bg-white/5 rounded-full grid place-items-center cursor-pointer">
                    {isZoomed ? <ZoomOut className="w-6 h-6" /> : <ZoomIn className="w-6 h-6" />}
                  </button>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 bg-white/15 text-white rounded-full hover:bg-white/25 transition-all grid place-items-center cursor-pointer">
                    <X className="w-7 h-7" />
                  </button>
              </div>
          </div>

          {/* Nav Arrows (ახლა მობილურზეც ჩანს) */}
          {!isZoomed && (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); handlePrev(); }} 
                className="absolute left-4 lg:left-10 top-1/2 -translate-y-1/2 w-12 h-12 lg:w-16 lg:h-16 bg-white/10 text-white rounded-full transition-all z-[100000] cursor-pointer grid place-items-center active:scale-90 hover:bg-white/20"
              >
                <ChevronLeft className="w-8 h-8 lg:w-10 lg:h-10" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); handleNext(); }} 
                className="absolute right-4 lg:right-10 top-1/2 -translate-y-1/2 w-12 h-12 lg:w-16 lg:h-16 bg-white/10 text-white rounded-full transition-all z-[100000] cursor-pointer grid place-items-center active:scale-90 hover:bg-white/20"
              >
                <ChevronRight className="w-8 h-8 lg:w-10 lg:h-10" />
              </button>
            </>
          )}

          {/* Modal Main View with Swipe & Zoom */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing" 
            onMouseDown={(e) => { if (isZoomed) { setIsDragging(true); dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y }; } }}
            onMouseMove={(e) => { if (isDragging && isZoomed) setPosition({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y }); }}
            onMouseUp={() => setIsDragging(false)}
            onTouchStart={(e) => {
                if (isZoomed) { setIsDragging(true); dragStart.current = { x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y }; }
                else handleTouchStart(e);
            }} 
            onTouchMove={(e) => {
                if (isDragging && isZoomed) setPosition({ x: e.touches[0].clientX - dragStart.current.x, y: e.touches[0].clientY - dragStart.current.y });
            }} 
            onTouchEnd={(e) => {
                setIsDragging(false);
                if (!isZoomed) handleTouchEnd(e, handleNext, handlePrev);
            }}
            onDoubleClick={toggleZoom}
          >
              <div className="relative w-full h-full transition-transform duration-300 ease-out" style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${isZoomed ? 2.5 : 1})` }}>
                <Image src={allImages[selectedIndex]} alt={alt} fill className="object-contain pointer-events-none" sizes="100vw" priority quality={100} />
              </div>
          </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4 h-full relative group/gallery select-none">
        
        {/* === THUMBNAILS (Desktop) === */}
        <div className="order-2 lg:order-1 relative lg:w-[115px] flex-shrink-0 group/thumbs">
          <button 
            onClick={() => scrollRef.current?.scrollBy({ top: -200, behavior: 'smooth' })} 
            className={`hidden lg:grid place-items-center absolute -top-8 left-1/2 -translate-x-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-xl border border-gray-100 text-brand-dark transition-all duration-300 hover:bg-brand-DEFAULT hover:text-white cursor-pointer ${canScrollUp ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <ChevronUp className="w-5 h-5" />
          </button>

          <div 
            ref={scrollRef} 
            onScroll={checkScroll} 
            className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto hide-scrollbar w-full lg:h-[600px] snap-x lg:snap-y scroll-smooth p-5 flex-nowrap"
          >
            {allImages.map((url, index) => (
              <button key={index} onClick={() => setSelectedIndex(index)} className={`relative flex-shrink-0 w-20 aspect-[4/5] lg:w-full rounded-xl overflow-hidden transition-all duration-300 snap-start cursor-pointer border-2 m-0.5 ${selectedIndex === index ? 'border-brand-DEFAULT scale-110 shadow-lg z-10' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                <Image src={url} alt={`${alt} thumbnail ${index + 1}`} fill className="object-cover" sizes="115px" />
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
          // ✅ touch-pan-y აგვარებს სქროლის კონფლიქტს: უშვებს ვერტიკალურ სქროლს, მაგრამ ბლოკავს ჰორიზონტალურს სვაიპისთვის
          className="order-1 lg:order-2 flex-1 relative w-full bg-gray-50 rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm aspect-[4/5] lg:h-[600px] cursor-zoom-in group/main touch-pan-y"
          onClick={() => setIsModalOpen(true)}
          onTouchStart={handleTouchStart} 
          onTouchEnd={(e) => handleTouchEnd(e, handleNext, handlePrev)}
        >
          <Image src={allImages[selectedIndex] || '/placeholder.jpg'} alt={alt} fill className="object-cover transition-transform duration-700 group-hover/main:scale-105" priority sizes="(max-width: 768px) 100vw, 800px" />
          <div className="absolute inset-0 bg-black/0 group-hover/main:bg-black/5 transition-colors grid place-items-center">
             <Maximize2 className="w-12 h-12 text-white opacity-0 group-hover/main:opacity-100 transition-all duration-300 transform scale-90 group-hover/main:scale-100 drop-shadow-2xl" />
          </div>
          <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-4 py-2 rounded-full md:hidden shadow-lg border border-white/10">
              {selectedIndex + 1} / {allImages.length}
          </div>
        </div>
      </div>

      {isModalOpen && mounted && createPortal(<ModalContent />, document.body)}
    </>
  );
}