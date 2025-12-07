import Image from 'next/image';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative h-[85vh] md:h-[800px] w-full overflow-hidden rounded-b-[2.5rem] md:rounded-b-none shadow-2xl md:shadow-none bg-black">
        <Image 
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
            alt="Hero Banner"
            fill
            className="object-cover opacity-90"
            priority
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:bg-gradient-to-r md:from-black/60 md:to-transparent"></div>
        
        {/* Content */}
        <div className="absolute bottom-12 left-6 right-6 md:bottom-32 md:left-24 md:max-w-2xl text-white z-10">
            <div className="flex gap-2 mb-4 md:mb-6 animate-fade-in-up">
                <span className="glass-panel text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md border-white/30">
                    New Season 2025
                </span>
                <span className="bg-red-600 text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Sale 30%
                </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-4 md:mb-6 leading-[0.9] tracking-tight drop-shadow-lg">
                Elevate Your <br /> Everyday Style.
            </h1>
            
            <p className="text-gray-200 mb-8 text-sm md:text-lg font-medium max-w-md md:leading-relaxed hidden md:block drop-shadow-md opacity-90">
                აღმოაჩინე პრემიუმ ხარისხის ჩანთები ექსკლუზიურ ფასად. უფასო მიწოდება მთელ საქართველოში.
            </p>
            
            <button className="group w-full md:w-auto bg-white text-mocha-dark px-8 py-4 rounded-2xl md:rounded-full font-bold text-sm md:text-base hover:bg-mocha-DEFAULT hover:text-white transition-all transform hover:scale-105 shadow-lg shadow-black/20 flex items-center justify-center gap-2">
                ნახე კოლექცია
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>

        {/* Desktop Floating Product Preview */}
        <div className="absolute bottom-16 right-16 hidden lg:block animate-fade-in delay-200">
            <div className="glass-panel p-4 rounded-2xl flex items-center gap-4 w-80 shadow-2xl border border-white/30 backdrop-blur-xl">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-inner bg-gray-100">
                    <Image 
                        src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=150"
                        alt="Preview"
                        fill
                        className="object-cover"
                    />
                </div>
                <div>
                    <div className="text-[10px] font-bold text-mocha-dark/60 uppercase tracking-wider">Best Seller</div>
                    <div className="font-bold text-mocha-dark text-lg leading-tight">Classic Tote</div>
                    <div className="text-mocha-DEFAULT font-black">189.00 ₾</div>
                </div>
                <button className="ml-auto bg-mocha-dark text-white p-3 rounded-full cursor-pointer hover:bg-mocha-DEFAULT transition active:scale-95 shadow-lg">
                    <ShoppingBag className="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>
  );
}