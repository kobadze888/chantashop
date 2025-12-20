import ProductCardSkeleton from '@/components/products/ProductCardSkeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 pt-10">
        {/* სათაურის სკელეტონი */}
        <div className="w-48 h-8 bg-gray-100 rounded-lg mb-8 animate-pulse" />

        <div className="flex flex-col md:flex-row gap-8">
          {/* ✅ საიდბარის (ფილტრების) სკელეტონი - ინახავს ადგილს მარცხნივ */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="h-5 w-32 bg-gray-100 rounded-md animate-pulse" />
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="h-4 w-full bg-gray-50 rounded-sm animate-pulse" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* ✅ პროდუქტების Grid - რჩება მარჯვნივ */}
          <div className="flex-1">
            {/* მობილური ფილტრების ღილაკის იმიტაცია */}
            <div className="md:hidden h-12 w-full bg-gray-50 rounded-xl mb-6 animate-pulse" />
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}