// src/app/[locale]/product/[slug]/loading.tsx
import { ChevronRight } from 'lucide-react';

export default function ProductLoading() {
  return (
    <div className="md:pt-32 pt-24 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-6 max-w-[1350px]">
        
        {/* Breadcrumbs Skeleton */}
        <nav className="text-xs font-bold text-gray-400 mb-10 flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-2">
            <div className="h-3 w-12 bg-gray-100 animate-pulse rounded"></div>
            <ChevronRight className="w-3 h-3 text-gray-200" />
            <div className="h-3 w-20 bg-gray-100 animate-pulse rounded"></div>
            <ChevronRight className="w-3 h-3 text-gray-200" />
            <div className="h-3 w-32 bg-gray-100 animate-pulse rounded"></div>
        </nav>

        {/* Product Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 pb-10">
          
          {/* Left Side: Gallery Skeleton */}
          <div className="lg:col-span-6 flex flex-col lg:flex-row gap-4 h-min lg:sticky lg:top-32">
            {/* Thumbnails (Desktop) */}
            <div className="hidden lg:flex flex-col gap-3 w-[90px]">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[4/5] w-full bg-gray-100 animate-pulse rounded-xl"></div>
              ))}
            </div>
            {/* Main Image */}
            <div className="flex-1 aspect-[4/5] bg-gray-50 animate-pulse rounded-[2rem] border border-gray-100"></div>
          </div>

          {/* Right Side: Product Info Skeleton */}
          <div className="lg:col-span-6 flex flex-col py-2">
            {/* Category & Status */}
            <div className="flex justify-between items-center mb-4">
              <div className="h-4 w-24 bg-gray-100 animate-pulse rounded"></div>
              <div className="h-6 w-20 bg-gray-100 animate-pulse rounded-full"></div>
            </div>

            {/* Title */}
            <div className="h-10 w-3/4 bg-gray-100 animate-pulse rounded-lg mb-3"></div>
            <div className="h-10 w-1/2 bg-gray-100 animate-pulse rounded-lg mb-3"></div>

            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-gray-100 animate-pulse rounded"></div>
              ))}
            </div>

            {/* Price Box */}
            <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="h-3 w-16 bg-gray-100 animate-pulse rounded"></div>
                <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-12 w-32 bg-gray-200 animate-pulse rounded-xl"></div>
                <div className="h-12 w-12 bg-gray-100 animate-pulse rounded-xl"></div>
              </div>
            </div>

            {/* Colors */}
            <div className="mb-8">
              <div className="h-4 w-20 bg-gray-100 animate-pulse rounded mb-3"></div>
              <div className="flex gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gray-100 animate-pulse"></div>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex gap-3 mb-8 pb-4">
              <div className="h-14 w-32 bg-gray-100 animate-pulse rounded-xl shadow-sm"></div>
              <div className="h-14 flex-1 bg-gray-200 animate-pulse rounded-xl shadow-sm"></div>
            </div>

            {/* Payment & Shipping Badges */}
            <div className="grid grid-cols-3 gap-2 md:gap-3 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-28 bg-gray-50 animate-pulse rounded-2xl border border-gray-100"></div>
              ))}
            </div>

            <div className="border-t border-gray-100 my-6"></div>

            {/* Description Blocks */}
            <div className="space-y-6">
              <div className="h-32 bg-gray-50 animate-pulse rounded-2xl border border-gray-100"></div>
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-xl border border-gray-100"></div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Related Products Carousel Skeleton */}
        <div className="mt-8 border-t border-gray-100 pt-8">
          <div className="h-8 w-48 bg-gray-100 animate-pulse rounded mb-8"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-gray-50 animate-pulse rounded-2xl border border-gray-100"></div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}