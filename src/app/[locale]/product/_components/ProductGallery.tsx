'use client';

import Image from 'next/image';
import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react'; 

interface ProductGalleryProps {
  mainImage: string;
  gallery: string[];
  alt: string;
}

export default function ProductGallery({ mainImage, gallery, alt }: ProductGalleryProps) {
  const allImages = useMemo(() => {
    const images = [mainImage, ...gallery.filter(url => url !== mainImage && url !== '')].filter(url => url);
    return images.filter((url, index, self) => self.indexOf(url) === index);
  }, [mainImage, gallery]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const selectedImage = allImages[currentImageIndex] || '/placeholder.jpg';

  const handlePrev = () => setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  const handleNext = () => setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  
  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 h-auto lg:h-[600px]">
      <div className="relative w-full lg:w-24 flex-shrink-0">
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto h-full pb-2 lg:pb-0 hide-scrollbar">
              {allImages.map((url, index) => (
                  <div
                      key={index}
                      className={`relative w-16 h-16 lg:w-20 lg:h-24 flex-shrink-0 rounded-xl overflow-hidden border cursor-pointer transition-all duration-200 ${
                          currentImageIndex === index 
                              ? 'border-brand-DEFAULT opacity-100 ring-2 ring-brand-light' 
                              : 'border-transparent opacity-60 hover:opacity-100 hover:border-gray-200'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                  >
                      <Image
                          src={url}
                          alt={`${alt} - ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="100px"
                      />
                  </div>
              ))}
          </div>
      </div>

      <div className="flex-1 relative bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 h-[450px] lg:h-full group shadow-sm">
        <Image
          src={selectedImage}
          alt={alt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        
        {allImages.length > 1 && (
            <>
                <button onClick={handlePrev} className="absolute top-1/2 left-4 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-md rounded-full text-brand-dark hover:bg-brand-DEFAULT hover:text-white transition-all shadow-lg z-20 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0"><ChevronLeft className="w-5 h-5" /></button>
                <button onClick={handleNext} className="absolute top-1/2 right-4 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-md rounded-full text-brand-dark hover:bg-brand-DEFAULT hover:text-white transition-all shadow-lg z-20 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0"><ChevronRight className="w-5 h-5" /></button>
                <div className="absolute bottom-6 right-6 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-bold text-white tracking-widest z-20">{currentImageIndex + 1} / {allImages.length}</div>
            </>
        )}
      </div>
    </div>
  );
}