import Header from '@/components/layout/Header';
import Hero from '@/components/home/Hero';
import Categories from '@/components/home/Categories';
import ProductGrid from '@/components/products/ProductGrid';
import BottomNav from '@/components/layout/BottomNav';
import { getProducts } from '@/lib/api';

// Dummy data for visual check if API is empty
const dummyProducts = [
    { id: 1, title: 'Urban Leather Tote', price: '145.00 ₾', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=500' },
    { id: 2, title: 'Black Edition Mini', price: '240.00 ₾', image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=500' },
    { id: 3, title: 'Classic Beige', price: '189.00 ₾', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=500' },
    { id: 4, title: 'Travel Duffel', price: '320.00 ₾', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=500' },
];

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  // Try to fetch real products, fallback to dummy
  let products = [];
  try {
      products = await getProducts(4);
      if (!products || products.length === 0) products = dummyProducts;
  } catch (e) {
      products = dummyProducts;
  }

  // Transform WP data if needed
  const displayProducts = products.map((p: any) => ({
      id: p.id || p.databaseId,
      title: p.name || p.title,
      price: p.price || p.price, // Format properly based on WP data
      image: p.image?.sourceUrl || p.image 
  }));

  return (
    <main className="min-h-screen bg-[#F8F5F2] pb-10">
      <Header />
      <Hero />
      <Categories />
      <ProductGrid products={displayProducts} />
      <BottomNav />
    </main>
  );
}