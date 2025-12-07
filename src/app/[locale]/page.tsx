import Hero from '../../components/home/Hero';
import Brands from '../../components/home/Brands';
import FeaturedCarousel from '../../components/home/FeaturedCarousel'; // ახალი კომპონენტი
import { getProducts } from '../../lib/api';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  // მონაცემების წამოღება (შეცდომის დაზღვევა)
  const products = await getProducts(8) || [];

  const formattedProducts = products.map((p: any) => ({
    id: p.databaseId,
    name: p.name, // HTML-ში name წერია და არა title
    price: p.salePrice || p.price,
    salePrice: p.salePrice,
    regularPrice: p.regularPrice,
    image: p.image?.sourceUrl || '/placeholder.jpg',
    // მეორე სურათი გალერეიდან (ჰოვერისთვის)
    secondImage: p.galleryImages?.nodes[0]?.sourceUrl || null,
    slug: p.slug
  }));

  return (
    <div className="min-h-screen bg-white">
      <Hero />
      
      <Brands />
      
      {/* აქ ვიყენებთ კარუსელს და არა გრიდს */}
      <FeaturedCarousel 
        title="Featured Products"
        subtitle={locale === 'ka' ? 'ახალი კოლექცია' : 'New Collection'}
        products={formattedProducts}
        locale={locale}
      />
    </div>
  );
}