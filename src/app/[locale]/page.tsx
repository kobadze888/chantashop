import Image from "next/image";
import { fetchAPI } from "@/lib/api";
import { Link } from "@/navigation";

export default async function Home({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const data = await fetchAPI(`
    query GetProducts {
      products(first: 100) {
        nodes {
          id
          slug
          name
          language {
            code
          }
          image {
            sourceUrl
            altText
          }
          ... on SimpleProduct {
            price
          }
          ... on VariableProduct {
            price
          }
        }
      }
    }
  `);

  const allProducts = data?.products?.nodes || [];

  // 🔥 ცვლილება აქ არის: მკაცრი ფილტრაცია
  const products = allProducts.filter((product: any) => {
    // 1. თუ პროდუქტს ენა საერთოდ არ აქვს -> არ გამოაჩინო არცერთ ენაზე (დამალე)
    if (!product.language) return false;

    // 2. თუ აქვს, შეადარე კოდი (KA === ka)
    return product.language.code.toLowerCase() === locale.toLowerCase();
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">
        {locale === 'ka' ? 'უახლესი კოლექცია' : locale === 'ru' ? 'Новая коллекция' : 'New Collection'}
      </h1>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-xl">
            {locale === 'ka' 
              ? 'ამ ენაზე პროდუქტები ჯერ არ დამატებულა.' 
              : 'Products not available in this language yet.'}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            (Check WordPress: Products must have "{locale.toUpperCase()}" language assigned)
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product: any) => (
            <Link 
              key={product.id} 
              href={`/product/${product.slug}`}
              className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-square w-full bg-gray-100">
                {product.image?.sourceUrl ? (
                  <Image
                    src={product.image.sourceUrl}
                    alt={product.image.altText || product.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
                  {product.name}
                </h3>
                <p className="mt-1 text-lg font-bold text-blue-600">
                  {product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}