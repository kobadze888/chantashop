// src/app/[locale]/page.tsx
import Hero from '@/components/home/Hero';
import Brands from '@/components/home/Brands';
import FeaturedCarousel from '@/components/home/FeaturedCarousel';
import { getProducts } from '@/lib/api';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  // აქ ვაწვდით locale-ს API-ს
  const products = await getProducts(8, locale) || [];

  const formattedProducts = products.map((p: any) => ({
    id: p.databaseId,
    name: p.name,
    price: p.salePrice || p.price,
    salePrice: p.salePrice,
    regularPrice: p.regularPrice,
    image: p.image?.sourceUrl || '/placeholder.jpg',
    secondImage: p.galleryImages?.nodes[0]?.sourceUrl || null,
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
      {/* Hero-ს შეიძლება დასჭირდეს პროპსებად ტექსტების მიწოდება */}
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