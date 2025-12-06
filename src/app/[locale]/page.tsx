import Hero from '@/components/home/Hero';
import Categories from '@/components/home/Categories';
import ProductGrid from '@/components/products/ProductGrid';
import BottomNav from '@/components/layout/BottomNav';
import { getProducts, getProductCategories } from '@/lib/api';

// Dummy data for development when API is not connected
const dummyProducts = [
  { id: 1, title: 'Urban Leather Tote', price: '145.00 ₾', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=500', slug: 'urban-leather-tote' },
  { id: 2, title: 'Black Edition Mini', price: '240.00 ₾', image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=500', slug: 'black-edition-mini' },
  { id: 3, title: 'Classic Beige', price: '189.00 ₾', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=500', slug: 'classic-beige' },
  { id: 4, title: 'Travel Duffel', price: '320.00 ₾', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=500', slug: 'travel-duffel' },
];
const dummyCategories = [
  { name: 'Mini', slug: 'mini', image: 'https://placehold.co/200x200/A68A64/FDFBF7?text=Mini' },
  { name: 'Tote', slug: 'tote', image: 'https://placehold.co/200x200/4A403A/FDFBF7?text=Tote' },
  { name: 'Leather', slug: 'leather', image: 'https://placehold.co/200x200/D6CCC2/4A403A?text=Leather' },
  { name: 'Travel', slug: 'travel', image: 'https://placehold.co/200x200/A68A64/FDFBF7?text=Travel' },
  { name: 'Sale', slug: 'sale', image: 'https://placehold.co/200x200/4A403A/FDFBF7?text=Sale' },
];


export default async function Home({ params }: { params: { locale: string } }) {
  const { locale } = params;

  // 1. Fetch Products
  let products = [];
  try {
    products = await getProducts(8, locale); // Fetch 8 popular products by locale
    if (!products || products.length === 0) products = dummyProducts;
  } catch (e) {
    console.error("Failed to fetch products:", e);
    products = dummyProducts;
  }

  // 2. Fetch Categories
  let categories = [];
  try {
    categories = await getProductCategories(5, locale); // Fetch 5 categories by locale
    if (!categories || categories.length === 0) categories = dummyCategories;
  } catch (e) {
    console.error("Failed to fetch categories:", e);
    categories = dummyCategories;
  }

  // Format data for components
  const displayProducts = products.map((p: any) => ({
    id: p.id || p.databaseId,
    title: p.name || 'No Title',
    price: p.price || '0.00 ₾',
    image: p.image?.sourceUrl || p.image,
    slug: p.slug || p.id
  }));

  const displayCategories = categories.map((c: any) => ({
    name: c.name || 'No Name',
    slug: c.slug || '#',
    image: c.image?.sourceUrl || c.image,
  }));


  return (
    // pt-20 added for fixed Header clearance on mobile
    <main className="min-h-screen bg-[#F8F5F2] pb-10 pt-20 md:pt-0">
      <Hero />
      <Categories categories={displayCategories} />
      <ProductGrid products={displayProducts} />
      <BottomNav />
    </main>
  );
}