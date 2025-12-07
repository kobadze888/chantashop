import Header from '../../components/layout/Header';
import BottomNav from '../../components/layout/BottomNav';
import Hero from '../../components/home/Hero';
import Categories from '../../components/home/Categories';
import ProductGrid from '../../components/products/ProductGrid';
import { getProducts } from '../../lib/api';

// ეს ინტერფეისი უნდა ემთხვეოდეს API-დან დაბრუნებულ მონაცემებს
interface Product {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  image: {
    sourceUrl: string;
    altText?: string;
  };
  price: string;
  regularPrice?: string;
  salePrice?: string;
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  // მონაცემების წამოღება სერვერულად (ISR)
  const products = await getProducts(8);

  // მონაცემების ფორმატირება კომპონენტისთვის (თუ საჭიროა)
  // ჩვენს შემთხვევაში API პირდაპირ კარგ ფორმატს აბრუნებს, უბრალოდ ტიპებს შევუსაბამებთ
  const formattedProducts = products.map((p: any) => ({
    id: p.databaseId,
    title: p.name,
    price: p.salePrice || p.price, // თუ ფასდაკლებაა, ვაჩვენოთ ფასდაკლებული
    image: p.image?.sourceUrl || '/placeholder.jpg', // Placeholder თუ ფოტო არ აქვს
    slug: p.slug
  }));

  return (
    <main className="min-h-screen bg-[#FDFBF7] pb-24 md:pb-10 relative">
      <Header />
      
      {/* Hero სექცია (სლაიდერი) */}
      <Hero />

      {/* კატეგორიები (Stories სტილში) */}
      <Categories />

      {/* პოპულარული პროდუქტები */}
      <ProductGrid products={formattedProducts} />

      {/* მობილური ნავიგაცია */}
      <BottomNav />
    </main>
  );
}