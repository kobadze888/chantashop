'use client';

import Image from 'next/image';
import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronUp, ChevronDown, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface ProductGalleryProps {
  mainImage: string;
  gallery: string[];
  alt: string;
}

export default function ProductGallery({ mainImage, gallery, alt }: ProductGalleryProps) {
  // 1. სურათების გაერთიანება
  const allImages = useMemo(() => {
      return [mainImage, ...gallery.filter(url => url !== mainImage)].filter(Boolean);
  }, [mainImage, gallery]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  // Client-side mount check
  useEffect(() => {
    setMounted(true);
  }, []);

  // --- სქროლის ლოგიკა (მინი გალერეისთვის) ---
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      setCanScrollUp(scrollTop > 0);
      setCanScrollDown(scrollTop + clientHeight < scrollHeight - 2);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [allImages]);

  const scroll = (direction: 'up' | 'down') => {
    if (scrollRef.current) {
      const scrollAmount = 140; 
      scrollRef.current.scrollBy({
        top: direction === 'down' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // --- მოდალის ლოგიკა ---
  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  // --- Modal Content Component (შიდა კომპონენტი) ---
  const ModalContent = () => {
    // Scroll Locking Effect
    useEffect(() => {
      document.body.style.overflow = 'hidden'; // სქროლის დაბლოკვა
      return () => {
        document.body.style.overflow = ''; // სქროლის დაბრუნება
      };
    }, []);

    // Zoom Logic
    const [isZoomed, setIsZoomed] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const imageContainerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isZoomed || !imageContainerRef.current) return;
      
      const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      
      setMousePos({ x, y });
    };

    const toggleZoom = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsZoomed(!isZoomed);
    };

    // Keyboard Navigation
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsModalOpen(false);
        if (!isZoomed) { // თუ ზუმი ჩართულია, ისრებით არ გადავრთოთ რომ ხელი არ შეეშალოს
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isZoomed]);

    return (
      <div className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md flex items-center justify-center animate-fade-in overscroll-contain">
          
          {/* Close Button */}
          <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 z-[100000] p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm cursor-pointer"
          >
              <X className="w-8 h-8" />
          </button>

          {/* Nav Buttons (Hidden when zoomed to avoid obstruction) */}
          {!isZoomed && (
            <>
              <button 
                  onClick={handlePrev}
                  className="absolute left-4 lg:left-10 top-1/2 -translate-y-1/2 p-4 bg-white/10 text-white rounded-full hover:bg-white/20 hover:scale-110 transition-all z-[100000] backdrop-blur-sm cursor-pointer"
              >
                  <ChevronLeft className="w-8 h-8" />
              </button>
              <button 
                  onClick={handleNext}
                  className="absolute right-4 lg:right-10 top-1/2 -translate-y-1/2 p-4 bg-white/10 text-white rounded-full hover:bg-white/20 hover:scale-110 transition-all z-[100000] backdrop-blur-sm cursor-pointer"
              >
                  <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Image Container with Zoom Logic */}
          <div className="relative w-full h-full p-0 lg:p-10 flex items-center justify-center overflow-hidden">
              <div 
                ref={imageContainerRef}
                onMouseMove={handleMouseMove}
                onClick={toggleZoom}
                className={`
                    relative w-full h-full max-w-7xl flex items-center justify-center transition-all duration-300
                    ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}
                `}
              >
                  <div 
                    className="relative w-full h-full transition-transform duration-200 ease-out"
                    style={{
                        transform: isZoomed ? 'scale(2)' : 'scale(1)',
                        transformOrigin: isZoomed ? `${mousePos.x}% ${mousePos.y}%` : 'center center'
                    }}
                  >
                    <Image
                        src={allImages[selectedIndex]}
                        alt={alt}
                        fill
                        className="object-contain drop-shadow-2xl pointer-events-none" // pointer-events-none რათა მაუსი კონტეინერმა წაიკითხოს
                        sizes="100vw"
                        priority
                        quality={100}
                    />
                  </div>
              </div>
          </div>

          {/* Thumbnails strip (Hidden when zoomed) */}
          {!isZoomed && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 overflow-x-auto max-w-[90vw] p-2 hide-scrollbar z-[100000]">
                {allImages.map((url, idx) => (
                    <button
                        key={idx}
                        onClick={(e) => { e.stopPropagation(); setSelectedIndex(idx); }}
                        className={`
                            relative w-14 h-18 rounded-lg overflow-hidden flex-shrink-0 transition-all cursor-pointer border border-white/20
                            ${selectedIndex === idx 
                                ? 'ring-2 ring-white scale-110 opacity-100 shadow-xl' 
                                : 'opacity-50 hover:opacity-100 hover:scale-105'
                            }
                        `}
                    >
                        <Image src={url} alt="thumb" fill className="object-cover" />
                    </button>
                ))}
            </div>
          )}
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4 h-full relative group/gallery select-none">
        
        {/* === THUMBNAILS (მარცხენა სვეტი) === */}
        <div className="order-2 lg:order-1 relative lg:w-[90px] flex-shrink-0">
          
          <button 
              onClick={() => scroll('up')}
              className={`
                hidden lg:flex absolute -top-3 left-1/2 -translate-x-1/2 z-20 
                w-8 h-8 items-center justify-center rounded-full
                bg-white shadow-md border border-gray-100 text-brand-dark 
                transition-all duration-300 hover:bg-brand-DEFAULT hover:text-white cursor-pointer
                ${canScrollUp ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
              `}
          >
              <ChevronUp className="w-4 h-4" />
          </button>

          <div 
              ref={scrollRef}
              onScroll={checkScroll}
              className="
                flex lg:flex-col gap-3 
                overflow-x-auto lg:overflow-y-auto hide-scrollbar 
                w-full lg:h-[600px] 
                snap-x lg:snap-y scroll-smooth py-2 px-1
              "
          >
            {allImages.map((url, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`
                  relative flex-shrink-0 
                  w-20 aspect-[4/5] lg:w-full 
                  rounded-xl overflow-hidden transition-all duration-200 snap-start cursor-pointer
                  ${selectedIndex === index 
                    ? 'ring-2 ring-offset-2 ring-brand-DEFAULT opacity-100 scale-[0.98]' 
                    : 'border border-gray-100 opacity-70 hover:opacity-100 hover:border-gray-300'
                  }
                `}
              >
                <Image
                  src={url}
                  alt={`${alt} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              </button>
            ))}
          </div>

          <button 
              onClick={() => scroll('down')}
              className={`
                hidden lg:flex absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 
                w-8 h-8 items-center justify-center rounded-full
                bg-white shadow-md border border-gray-100 text-brand-dark 
                transition-all duration-300 hover:bg-brand-DEFAULT hover:text-white cursor-pointer
                ${canScrollDown ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
              `}
          >
              <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* === MAIN IMAGE (მარჯვენა მხარე) === */}
        <div 
          className="order-1 lg:order-2 flex-1 relative w-full bg-gray-50 rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm aspect-[4/5] lg:h-[600px] cursor-zoom-in group/main"
          onClick={() => setIsModalOpen(true)}
        >
          <Image
            src={allImages[selectedIndex] || '/placeholder.jpg'}
            alt={alt}
            fill
            className="object-cover transition-transform duration-500 group-hover/main:scale-105"
            priority
            sizes="(max-width: 768px) 100vw, 700px"
          />
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover/main:opacity-100 transition-opacity duration-300 pointer-events-none text-white">
             <ZoomIn className="w-8 h-8" />
          </div>

          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full md:hidden">
              {selectedIndex + 1} / {allImages.length}
          </div>
        </div>

      </div>

      {/* === PORTAL MODAL === */}
      {isModalOpen && mounted && createPortal(<ModalContent />, document.body)}
    </>
  );
}