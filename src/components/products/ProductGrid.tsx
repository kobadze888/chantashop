import Image from 'next/image';
import { Heart } from 'lucide-react';

interface Product {
    id: number;
    title: string;
    price: string;
    image: string;
}

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <section className="mt-6 px-4 pb-24 md:container md:mx-auto md:pb-10">
        <h3 className="font-bold text-mocha-dark mb-4 text-sm md:text-xl uppercase tracking-wider">პოპულარული</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {products.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl p-2 pb-3 md:p-3 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer">
                    <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-3 bg-mocha-light">
                        <Image 
                            src={product.image} 
                            alt={product.title} 
                            fill 
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full text-mocha-dark hover:bg-mocha-DEFAULT hover:text-white transition">
                            <Heart className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </div>
                    </div>
                    <div className="px-1">
                        <h4 className="font-bold text-sm md:text-base text-mocha-dark truncate">{product.title}</h4>
                        <p className="text-mocha-DEFAULT text-xs md:text-sm font-black mt-1">{product.price}</p>
                    </div>
                </div>
            ))}
        </div>
    </section>
  );
}