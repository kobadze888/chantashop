import Image from 'next/image';

const categories = [
    { name: 'Mini', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=200' },
    { name: 'Tote', image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=200' },
    { name: 'Leather', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=200' },
    { name: 'Travel', image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=200' },
    { name: 'Sale', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=200' },
];

export default function Categories() {
  return (
    <section className="mt-8 px-4 md:px-0 md:container md:mx-auto md:mt-16">
        <h3 className="font-bold text-mocha-dark mb-4 text-sm md:text-xl uppercase tracking-wider">კატეგორიები</h3>
        <div className="flex gap-4 md:gap-8 overflow-x-auto hide-scrollbar pb-4">
            {categories.map((cat, i) => (
                <div key={i} className="flex-shrink-0 text-center group cursor-pointer">
                    <div className="w-16 h-16 md:w-24 md:h-24 rounded-full p-[2px] bg-gradient-to-tr from-mocha-DEFAULT to-mocha-medium group-hover:scale-105 transition-transform duration-300">
                        <div className="w-full h-full rounded-full border-2 border-white overflow-hidden relative">
                            <Image 
                                src={cat.image} 
                                alt={cat.name} 
                                fill 
                                className="object-cover" 
                            />
                        </div>
                    </div>
                    <span className="text-[11px] md:text-sm mt-2 font-bold text-mocha-dark/80 block uppercase">{cat.name}</span>
                </div>
            ))}
        </div>
    </section>
  );
}