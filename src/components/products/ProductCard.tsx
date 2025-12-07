'use client';

import Image from 'next/image';
import { Link } from '@/navigation';
import { Eye, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  salePrice?: string;
  regularPrice?: string;
  image: string;
  secondImage?: string;
  slug: string;
  locale: string;
  className?: string; // დამატებითი სტილისთვის (მაგ: კარუსელში სიგანე)
}

export default function ProductCard({ id, name, price, salePrice, regularPrice, image, secondImage, slug, className }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id, name, price: salePrice || price, image, slug });
  };

  const displayPrice = salePrice || price;

  return (
    <div className={`group relative flex flex-col bg-white rounded-[1.5rem] md:rounded-[2rem] p-3 md:p-4 transition-all hover:shadow-2xl hover:-translate-y-2 border border-gray-100 h-full ${className || ''}`}>
      
      <Link href={`/product/${slug}`} className="block relative aspect-[4/5] bg-gray-100 rounded-[1.2rem] md:rounded-[1.5rem] overflow-hidden mb-3 md:mb-5">
          {/* მთავარი სურათი */}
          <Image 
            src={image || '/placeholder.jpg'} 
            alt={name} 
            fill 
            className={`object-cover transition-transform duration-700 group-hover:scale-110 ${secondImage ? 'group-hover:opacity-0' : ''}`}
          />
          
          {/* მეორე სურათი ჰოვერზე */}
          {secondImage && (
            <Image 
              src={secondImage} 
              alt={`${name} hover`} 
              fill 
              className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-110"
            />
          )}
          
          {/* Sale Badge */}
          {salePrice && (
             <span className="absolute top-2 left-2 md:top-4 md:left-4 bg-brand-DEFAULT text-white text-[9px] md:text-[10px] font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-full uppercase tracking-wider z-10">
               SALE
             </span>
          )}

          {/* Desktop Quick View Overlay */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 hidden md:flex z-20 pointer-events-none">
              <button className="bg-white text-brand-dark w-12 h-12 rounded-full flex items-center justify-center hover:bg-brand-DEFAULT hover:text-white transition shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300 pointer-events-auto">
                  <Eye className="w-5 h-5" />
              </button>
          </div>
      </Link>

      <div className="px-1 md:px-2 flex-1 flex flex-col">
          <Link href={`/product/${slug}`}>
            <h3 className="font-bold text-brand-dark text-sm md:text-xl leading-tight mb-1 md:mb-2 hover:text-brand-DEFAULT transition cursor-pointer truncate">
              {name}
            </h3>
          </Link>
          
          <p className="text-[10px] md:text-sm text-gray-500 mb-2 md:mb-4 line-clamp-2 leading-relaxed">
             {/* აქ შეგიძლიათ მოკლე აღწერა გამოიტანოთ თუ API-დან მოდის */}
             პრემიუმ ხარისხის, დახვეწილი დიზაინი.
          </p>

          <div className="flex flex-col md:flex-row md:items-center justify-between mt-auto gap-2 md:gap-0">
              <div className="flex flex-col">
                {regularPrice && regularPrice !== displayPrice && (
                    <span className="text-[10px] text-gray-400 line-through decoration-red-500">{regularPrice}</span>
                )}
                <span className="text-base md:text-2xl font-black text-brand-dark">{displayPrice}</span>
              </div>
              
              <div className="flex gap-1 md:gap-2 w-full md:w-auto">
                  {/* Mobile Eye Button */}
                  <button className="md:hidden w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-brand-dark hover:bg-gray-50 bg-white">
                      <Eye className="w-4 h-4" />
                  </button>
                  {/* Buy Button */}
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 md:flex-none bg-brand-dark text-white px-3 py-2 md:px-5 md:py-2.5 rounded-full text-[10px] md:text-sm font-bold hover:bg-brand-DEFAULT transition shadow-lg flex items-center justify-center gap-2 active:scale-95"
                  >
                    ყიდვა
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
}