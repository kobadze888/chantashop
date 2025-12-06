'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';

interface Category {
    name: string;
    slug: string;
    image: string;
}

export default function Categories({ categories }: { categories: Category[] }) {
  const t = useTranslations('Categories');
  
  return (
    <section className="mt-8 px-4 md:px-0 md:container md:mx-auto md:mt-16">
        <h3 className="font-bold text-mocha-dark mb-4 text-sm md:text-xl uppercase tracking-wider">{t('title')}</h3>
        <div className="flex gap-4 md:gap-8 overflow-x-auto hide-scrollbar pb-4">
            {categories.map((cat, i) => (
                <Link key={i} href={`/shop/${cat.slug}`} className="flex-shrink-0 text-center group cursor-pointer"> 
                    <div className="w-16 h-16 md:w-24 md:h-24 rounded-full p-[2px] bg-gradient-to-tr from-mocha-DEFAULT to-mocha-medium group-hover:scale-105 transition-transform duration-300">
                        <div className="w-full h-full rounded-full border-2 border-white overflow-hidden relative">
                            <Image 
                                src={cat.image || 'https://placehold.co/200x200/D6CCC2/4A403A?text=Category'} 
                                alt={cat.name} 
                                fill 
                                className="object-cover" 
                                sizes="(max-width: 768px) 16vw, 10vw"
                            />
                        </div>
                    </div>
                    <span className="text-[11px] md:text-sm mt-2 font-bold text-mocha-dark/80 block uppercase">{cat.name}</span>
                </Link>
            ))}
        </div>
    </section>
  );
}