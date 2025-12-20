'use client';

export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-[1.5rem] md:rounded-[1.8rem] p-3 md:p-4 border border-gray-100 h-full animate-pulse">
      {/* სურათი */}
      <div className="relative mb-3 md:mb-4 aspect-[4/5] rounded-[1.2rem] md:rounded-[1.5rem] bg-gray-200" />

      {/* ტექსტური ნაწილი */}
      <div className="flex-1 flex flex-col px-0.5 md:px-1">
          <div className="h-4 bg-gray-200 rounded-full w-full mb-2" />
          <div className="h-4 bg-gray-200 rounded-full w-2/3 mb-4" />
          
          <div className="flex gap-1 mb-4 items-center">
              <div className="w-3 h-3 rounded-full bg-gray-100" />
              <div className="w-3 h-3 rounded-full bg-gray-100" />
          </div>

          {/* ქვედა ზოლი */}
          <div className="mt-auto pt-4 border-t border-dashed border-gray-100 flex items-center justify-between">
              <div className="space-y-1">
                <div className="h-3 bg-gray-100 rounded-full w-8" />
                <div className="h-6 bg-gray-200 rounded-full w-16" />
              </div>
              <div className="flex gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-200 md:hidden" />
                  <div className="hidden md:block h-11 w-24 rounded-full bg-gray-200" />
              </div>
          </div>
      </div>
    </div>
  );
}