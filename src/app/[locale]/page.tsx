import Navbar from '@/components/layout/Navbar';
// Убедись, что путь правильный. Если Hero.tsx лежит в src/components/home/Hero.tsx, то импорт верный.
import { Hero } from '@/components/home/Hero';

export default async function Home({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  // В новых версиях Next.js params это Promise, поэтому нужно использовать await
  const { locale } = await params;

  return (
    <main className="min-h-screen bg-[#FDFBF7] font-sans selection:bg-[#A68A64] selection:text-white">
      <Navbar />
      <Hero />
      
      {/* Секция категорий */}
      <section className="py-20 container mx-auto px-6">
        <div className="flex justify-between items-end mb-8">
          <h3 className="text-2xl font-bold text-mocha-dark">Категории</h3>
          <a href="#" className="text-sm font-bold text-mocha-DEFAULT hover:text-mocha-dark transition underline decoration-2 underline-offset-4">Все</a>
        </div>
        
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
            <div className="flex-shrink-0 bg-mocha-dark text-white px-8 py-6 rounded-2xl font-bold text-lg shadow-lg cursor-pointer min-w-[160px] flex items-end h-40">
                Чемоданы
            </div>
            <div className="flex-shrink-0 bg-white text-mocha-dark border border-mocha-medium/30 px-8 py-6 rounded-2xl font-bold text-lg shadow-sm cursor-pointer min-w-[160px] flex items-end h-40 hover:border-mocha-DEFAULT transition">
                Сумки
            </div>
            <div className="flex-shrink-0 bg-white text-mocha-dark border border-mocha-medium/30 px-8 py-6 rounded-2xl font-bold text-lg shadow-sm cursor-pointer min-w-[160px] flex items-end h-40 hover:border-mocha-DEFAULT transition">
                Очки
            </div>
             <div className="flex-shrink-0 bg-white text-mocha-dark border border-mocha-medium/30 px-8 py-6 rounded-2xl font-bold text-lg shadow-sm cursor-pointer min-w-[160px] flex items-end h-40 hover:border-mocha-DEFAULT transition">
                Аксессуары
            </div>
        </div>
      </section>

    </main>
  );
}