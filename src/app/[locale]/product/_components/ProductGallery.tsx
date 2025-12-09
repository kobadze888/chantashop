'use client';

import Image from 'next/image';
import { useState, useMemo } from 'react';

interface ProductGalleryProps {
  mainImage: string;
  gallery: string[];
  alt: string;
}

export default function ProductGallery({ mainImage, gallery, alt }: ProductGalleryProps) {
  const allImages = useMemo(() => {
      return [mainImage, ...gallery.filter(url => url !== mainImage)].filter(Boolean);
  }, [mainImage, gallery]);

  const [selectedImage, setSelectedImage] = useState(allImages[0]);

  return (
    <div className="flex flex-col gap-4 lg:flex-row-reverse lg:gap-6">
      
      {/* მთავარი სურათი (დიდი) */}
      {/* ✅ შესწორება: lg:h-[600px] xl:h-[650px] lg:aspect-auto */}
      <div className="relative w-full aspect-[4/5] md:aspect-square lg:aspect-auto lg:h-[600px] xl:h-[650px] bg-gray-50 rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm group">
        <Image
          src={selectedImage || '/placeholder.jpg'}
          alt={alt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        
        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full font-bold md:hidden">
            {allImages.indexOf(selectedImage) + 1} / {allImages.length}
        </div>
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto hide-scrollbar pb-2 lg:pb-0 lg:w-24 lg:h-[600px] xl:h-[650px] flex-shrink-0">
          {allImages.map((url, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(url)}
              className={`relative flex-shrink-0 w-16 h-16 lg:w-24 lg:h-24 rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                selectedImage === url 
                  ? 'border-brand-DEFAULT ring-2 ring-brand-light ring-offset-1 opacity-100' 
                  : 'border-transparent hover:border-gray-200 opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={url}
                alt={`${alt} view ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}