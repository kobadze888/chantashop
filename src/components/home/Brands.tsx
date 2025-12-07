const brands = ["GUCCI", "PRADA", "CHANEL", "DIOR", "FENDI", "HERMÈS", "GUCCI", "PRADA", "CHANEL"];

export default function Brands() {
  return (
    <div className="py-20 overflow-hidden bg-brand-gray border-y border-gray-100 relative">
      <div className="container mx-auto px-4 mb-10 text-center">
          <span className="text-brand-DEFAULT text-sm font-bold tracking-[0.3em] uppercase mb-2 block">პრემიუმ ხარისხი</span>
          <h3 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark">ექსკლუზიური ბრენდები</h3>
      </div>
      
      <div className="relative w-full overflow-hidden">
           <div className="absolute top-0 bottom-0 left-0 w-10 md:w-40 z-10 bg-gradient-to-r from-brand-gray to-transparent"></div>
           <div className="absolute top-0 bottom-0 right-0 w-10 md:w-40 z-10 bg-gradient-to-l from-brand-gray to-transparent"></div>
           
          <div className="inline-flex flex-nowrap animate-infinite-scroll hover:[animation-play-state:paused] py-4">
              <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8">
                  {brands.map((brand, index) => (
                      <li key={index}>
                          <span className="text-5xl md:text-7xl font-serif text-gray-300 hover:text-brand-dark transition cursor-pointer font-bold">{brand}</span>
                      </li>
                  ))}
                  {brands.map((brand, index) => (
                      <li key={`dup-${index}`}>
                          <span className="text-5xl md:text-7xl font-serif text-gray-300 hover:text-brand-dark transition cursor-pointer font-bold">{brand}</span>
                      </li>
                  ))}
              </ul>
          </div>
      </div>
    </div>
  );
}