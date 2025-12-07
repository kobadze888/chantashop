'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ProductGalleryProps {
  mainImage: string;
  gallery: string[];
  alt: string;
}

export default function ProductGallery({ mainImage, gallery, alt }: ProductGalleryProps) {
  const allImages = [mainImage, ...gallery.filter(url => url !== mainImage && url !== '')].filter(url => url);
  const [selectedImage, setSelectedImage] = useState(mainImage || (allImages.length > 0 ? allImages[0] : '/placeholder.jpg'));

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-6">
      
      {/* პატარა სურათები (Thumbnails) */}
      <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto hide-scrollbar lg:max-h-[600px] lg:w-28 pb-2">
        {allImages.map((url, index) => (
          <div
            key={index}
            className={`min-w-[100px] lg:min-w-0 h-24 lg:h-28 rounded-2xl overflow-hidden border-2 cursor-pointer transition p-1 ${
              selectedImage === url 
                ? 'border-brand-DEFAULT opacity-100' 
                : 'border-transparent opacity-60 hover:opacity-100 hover:border-gray-300'
            }`}
            onClick={() => setSelectedImage(url)}
          >
            <Image
              src={url}
              alt={`${alt} - ${index + 1}`}
              width={112}
              height={112}
              className="object-cover w-full h-full rounded-xl"
            />
          </div>
        ))}
      </div>

      {/* მთავარი სურათი */}
      <div className="flex-1 bg-gray-50 rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 aspect-square lg:aspect-auto lg:h-[650px] relative group">
        <Image
          src={selectedImage}
          alt={alt}
          fill
          className="object-cover transition duration-1000 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>
    </div>
  );
}