// src/app/[locale]/product/_components/ProductGallery.tsx

'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ProductGalleryProps {
  mainImage: string;
  gallery: string[];
  alt: string;
}

export default function ProductGallery({ mainImage, gallery, alt }: ProductGalleryProps) {
  // ფილტრავს დუბლიკატებს და ალაგებს მთავარ სურათს პირველზე
  const allImages = [mainImage, ...gallery.filter(url => url !== mainImage && url !== '')].filter(url => url);
  const [selectedImage, setSelectedImage] = useState(mainImage || (allImages.length > 0 ? allImages[0] : '/placeholder.jpg'));

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      
      {/* პატარა სურათების სვეტი */}
      <div className="order-2 lg:order-1 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto hide-scrollbar max-h-[80vh] pb-4 lg:w-24">
        {allImages.map((url, index) => (
          <div
            key={index}
            className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 lg:w-full rounded-xl overflow-hidden cursor-pointer transition-all ${
              selectedImage === url ? 'border-4 border-mocha-DEFAULT shadow-md' : 'border-2 border-mocha-medium/30'
            }`}
            onClick={() => setSelectedImage(url)}
          >
            <Image
              src={url}
              alt={`${alt} - ${index + 1}`}
              width={80}
              height={80}
              className="object-cover w-full h-full"
              priority={index === 0} 
            />
          </div>
        ))}
      </div>

      {/* დიდი სურათის ჩვენება */}
      <div className="order-1 lg:order-2 relative aspect-square w-full lg:flex-1 rounded-2xl overflow-hidden shadow-xl bg-mocha-light">
        <Image
          src={selectedImage}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>
    </div>
  );
}