// src/app/[locale]/page.tsx
import Hero from '@/components/home/Hero';
import Brands from '@/components/home/Brands';
import FeaturedCarousel from '@/components/home/FeaturedCarousel';
import { getProducts } from '@/lib/api';
import { Product } from '@/types'; // Product ტიპის იმპორტი

// ✅ დამხმარე ფუნქცია, რომელიც იპოვის პირველ ხელმისაწვდომ სურათს გალერეაში
function getSecondImage(product: Product): string | null {
  const galleryNodes = product.galleryImages?.nodes;
  if (!galleryNodes) return null;
  
  // ვცდილობთ nodes[0] (მეორე სურათი)
  let secondImage = galleryNodes[0]?.sourceUrl;
  if (secondImage) return secondImage;

  // თუ nodes[0] ცარიელია, ვცდილობთ nodes[1] (მესამე სურათი)
  secondImage = galleryNodes[1]?.sourceUrl;
  if (secondImage) return secondImage;

  // თუ nodes[1] ცარიელია, ვცდილობთ nodes[2] (მეოთხე სურათი)
  secondImage = galleryNodes[2]?.sourceUrl;
  if (secondImage) return secondImage;
  
  return null;
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  const products = await getProducts({ limit: 8 }, locale) || []; // ლიმიტი 8-ზე

  const formattedProducts = products.map((p: any) => ({
    id: p.databaseId,
    name: p.name,
    price: p.salePrice || p.price,
    salePrice: p.salePrice,
    regularPrice: p.regularPrice,
    image: p.image?.sourceUrl || '/placeholder.jpg',
    // ✅ ლოგიკა გაუმჯობესდა: ვიყენებთ getSecondImage-ს
    secondImage: getSecondImage(p),
    slug: p.slug
  }));

  // ტექსტების თარგმნა (Static translation)
  const translations = {
    ka: { subtitle: 'ახალი კოლექცია', title: 'რჩეული პროდუქტები' },
    en: { subtitle: 'New Collection', title: 'Featured Products' },
    ru: { subtitle: 'Новая Коллекция', title: 'Рекомендуемые Товары' },
  };

  const t = translations[locale as keyof typeof translations] || translations.ka;

  return (
    <div className="min-h-screen bg-white">
      <Hero /> 
      <Brands />
      <FeaturedCarousel 
        title={t.title}
        subtitle={t.subtitle}
        products={formattedProducts}
        locale={locale}
      />
    </div>
  );
}