'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Heart } from 'lucide-react';

interface ProductProps {
  id: number;
  slug: string;
  title: string;
  price: string;
  image: string;
  category?: string;
  locale: string;
}

export default function ProductCard({ title, price, image, category, slug, locale }: ProductProps) {
  return (
    <Link href={`/${locale}/product/${slug}`} className="group relative block h-full">
      <div className="relative bg-white rounded-2xl p-3 pb-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-mocha-medium/20 h-full flex flex-col">
        
        <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden mb-3 bg-mocha-light">
          <Image 
            src={image || '/placeholder.jpg'} 
            alt={title}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          
          <div className="absolute top-3 right-3 opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
            <button 
              className="bg-white/80 backdrop-blur-md p-2 rounded-full text-mocha-dark hover:bg-mocha-DEFAULT hover:text-white transition-colors"
              aria-label="Add to Wishlist"
              onClick={(e) => { e.preventDefault(); /* Add logic */ }}
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>
          
          {category && (
            <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-md uppercase font-bold tracking-wider">
              {category}
            </span>
          )}
        </div>

        <div className="mt-auto px-1">
          <h3 className="font-bold text-mocha-dark text-sm leading-tight mb-2 line-clamp-2 min-h-[2.5em]">
            {title}
          </h3>
          <div className="flex justify-between items-center">
            <p className="text-mocha-DEFAULT font-black text-sm">{price}</p>
            <button 
              className="bg-mocha-dark text-white p-2 rounded-full hover:bg-mocha-DEFAULT transition-colors active:scale-95"
              aria-label="Add to Cart"
              onClick={(e) => { e.preventDefault(); /* Add logic */ }}
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}