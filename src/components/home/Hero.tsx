'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative h-[85vh] min-h-[600px] w-full bg-[#FDFBF7] overflow-hidden">
      
      {/* Изображение */}
      <div className="absolute inset-0">
        <Image 
          src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=2000&auto=format&fit=crop" 
          alt="Lifestyle Collection"
          fill
          className="object-cover object-center opacity-95"
          priority
        />
        {/* Легкий градиент снизу */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-transparent to-transparent"></div>
      </div>

      {/* Текст */}
      <div className="absolute bottom-0 left-0 right-0 pb-16 pt-32">
        <div className="container mx-auto px-6">
          <div className="max-w-xl animate-fade-in-up">
            
            <div className="flex gap-3 mb-6">
                 <span className="bg-white/90 text-mocha-dark text-xs font-bold px-4 py-2 rounded-md uppercase tracking-wider shadow-sm">
                    New In
                 </span>
                 <span className="bg-white/90 text-mocha-dark text-xs font-bold px-4 py-2 rounded-md uppercase tracking-wider shadow-sm">
                    Travel
                 </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[0.9] text-mocha-dark drop-shadow-sm">
              Natural <br/>
              <span className="text-white drop-shadow-md">Comfort.</span>
            </h1>
            
            <p className="text-mocha-dark mb-10 text-lg font-medium max-w-md">
              Уют и стиль в каждой детали. Аксессуары премиум-класса.
            </p>
            
            <Link 
              href="/shop" 
              className="group inline-flex items-center gap-3 bg-mocha-dark text-[#FDFBF7] px-10 py-4 rounded-2xl font-bold hover:bg-[#292524] transition-all transform hover:scale-105 shadow-xl shadow-mocha-dark/20"
            >
              Посмотреть коллекцию
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
}