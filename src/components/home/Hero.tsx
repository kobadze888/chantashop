import Image from 'next/image';
import { ArrowDown } from 'lucide-react';
import { Link } from '@/navigation';

export default function Hero() {
  return (
    // მთავარი კონტეინერი: ზუსტი ზომები და მომრგვალება HTML-დან
    <div className="relative mx-4 md:container md:mx-auto mt-28 md:mt-32 rounded-[2.5rem] overflow-hidden shadow-2xl h-[75vh] md:h-[650px] group bg-black">
        
        {/* ფონის სურათი - ანიმაციით */}
        <Image 
            src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=2070&auto=format&fit=crop"
            alt="Hero Banner"
            fill
            className="object-cover transition-transform duration-[3s] group-hover:scale-105 opacity-80"
            priority
        />
        
        {/* გრადიენტი */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

        {/* ტექსტური კონტენტი */}
        <div className="absolute inset-0 flex flex-col md:flex-row p-8 md:p-16 justify-end md:justify-between items-start md:items-center">
            <div className="text-white max-w-xl z-10 md:mb-0 mb-8 w-full animate-fade-in">
                
                {/* Badge */}
                <div className="flex gap-2 mb-6">
                    <span className="bg-brand-DEFAULT text-white text-[10px] md:text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg border border-white/20">
                        New Arrival
                    </span>
                </div>

                {/* სათაური - Playfair Display ფონტით */}
                <h1 className="text-5xl md:text-8xl font-serif italic font-black leading-[0.9] mb-8 drop-shadow-2xl tracking-tight">
                    Iconic <br /> <span className="text-brand-DEFAULT not-italic font-sans">Luxury.</span>
                </h1>

                {/* ღილაკი */}
                <Link href="/collection" className="group w-full md:w-auto bg-white text-brand-dark px-10 py-4 rounded-full font-bold text-sm md:text-base hover:bg-brand-DEFAULT hover:text-white transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-3">
                    აღმოაჩინე კოლექცია 
                    <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                </Link>
            </div>
        </div>
    </div>
  );
}