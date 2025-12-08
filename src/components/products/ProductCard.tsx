'use client';

import Image from 'next/image';
import { Link } from '@/navigation';
import { Eye } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

// ფერების რუკა
const colorMap: Record<string, string> = {
  'shavi': '#000000', 'tetri': '#FFFFFF', 'lurji': '#2563EB', 'muqi_lurji': '#1E3A8A',
  'cisferi': '#60A5FA', 'beji': '#F5F5DC', 'yavisferi': '#8B4513', 'vardisferi': '#DB2777',
  'witeli': '#DC2626', 'mwvane': '#16A34A', 'stafilosferi': '#F97316', 'nacrisferi': '#9CA3AF',
  'vercxlisferi': '#C0C0C0', 'oqrosferi': '#FFD700', 'iasamnisferi': '#A855F7', 'kanisferi': '#FFE4C4'
};

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
  attributes?: any; 
  className?: string;
  onQuickView?: (e: React.MouseEvent) => void; // ✅ ახალი პროპი მოდალისთვის
}

export default function ProductCard({ id, name, price, salePrice, regularPrice, image, secondImage, slug, attributes, className, onQuickView }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id, name, price: salePrice || price, image, slug });
  };

  const displayPrice = salePrice || price;
  const colorAttribute = attributes?.nodes?.find((attr: any) => attr.name === 'pa_color');
  const colorOptions = colorAttribute?.options || [];

  return (
    <div className={`group relative flex flex-col bg-white rounded-[2rem] p-4 transition-all hover:shadow-2xl hover:-translate-y-2 border border-gray-100 h-full ${className || ''}`}>
      
      <Link href={`/product/${slug}`} className="block relative aspect-[4/5] bg-gray-50 rounded-[1.5rem] overflow-hidden mb-5">
          {/* მთავარი სურათი (ქრება ჰოვერზე, თუ მეორე სურათი არსებობს) */}
          <Image 
            src={image || '/placeholder.jpg'} 
            alt={name} 
            fill 
            className={`object-cover transition-opacity duration-500 ease-in-out ${secondImage ? 'group-hover:opacity-0' : ''}`}
          />
          
          {/* მეორე სურათი (ჩნდება ჰოვერზე) */}
          {secondImage && (
            <Image 
              src={secondImage} 
              alt={`${name} hover`} 
              fill 
              className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
            />
          )}
          
          {salePrice && (
             <span className="absolute top-4 left-4 bg-brand-DEFAULT text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10">
               SALE
             </span>
          )}

          {/* Quick View ღილაკი */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 hidden md:flex z-20 pointer-events-none">
              <button 
                onClick={(e) => {
                    e.preventDefault(); 
                    e.stopPropagation(); // არ გადავიდეს პროდუქტის გვერდზე
                    onQuickView?.(e);
                }}
                className="bg-white text-brand-dark w-12 h-12 rounded-full flex items-center justify-center hover:bg-brand-DEFAULT hover:text-white transition shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300 pointer-events-auto"
              >
                  <Eye className="w-5 h-5" />
              </button>
          </div>
      </Link>

      <div className="flex-1 flex flex-col">
          <Link href={`/product/${slug}`}>
            <h3 className="font-bold text-brand-dark text-lg leading-tight mb-2 hover:text-brand-DEFAULT transition cursor-pointer truncate">
              {name}
            </h3>
          </Link>
          
          {/* ფერების ბურთულები */}
          {colorOptions.length > 0 && (
            <div className="flex gap-1.5 mb-4 items-center">
                <span className="text-xs font-medium text-gray-500 mr-2">ფერები:</span>
                {colorOptions.slice(0, 4).map((colorSlug: string, index: number) => (
                  <span 
                    key={index}
                    className="w-3.5 h-3.5 rounded-full border border-gray-300"
                    style={{ backgroundColor: colorMap[colorSlug.toLowerCase()] || '#e5e7eb' }}
                    title={colorSlug}
                  ></span>
                ))}
                {colorOptions.length > 4 && (
                  <span className="text-[10px] text-gray-400">+{colorOptions.length - 4}</span>
                )}
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-center justify-between mt-auto gap-3">
              <div className="flex flex-col">
                {regularPrice && regularPrice !== displayPrice && (
                    <span className="text-xs text-gray-400 line-through decoration-red-500 mb-0.5">{regularPrice}</span>
                )}
                <span className="text-xl font-black text-brand-dark">{displayPrice}</span>
              </div>
              
              <button 
                onClick={handleAddToCart}
                className="bg-brand-dark text-white w-full md:w-auto px-5 py-2.5 rounded-full text-xs font-bold hover:bg-brand-DEFAULT transition shadow-lg active:scale-95"
              >
                ყიდვა
              </button>
          </div>
      </div>
    </div>
  );
}