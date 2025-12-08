// src/lib/api.ts
import { WORDPRESS_API_URL, REVALIDATE_TIME } from './constants';
import { GET_PRODUCTS_QUERY, GET_FILTERS_QUERY, GET_PRODUCT_BY_SLUG_QUERY } from './queries';
import { Product } from '@/types';

async function fetchAPI(query: string, { variables }: { variables?: any } = {}, revalidateTime: number) {
  const headers = { 'Content-Type': 'application/json' };
  try {
    const res = await fetch(WORDPRESS_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
      // ✅ Cache Optimization: ყოველ 60 წამში მოხდეს ქეშის განახლება
      next: { revalidate: revalidateTime > 0 ? revalidateTime : 60 },
      cache: 'force-cache', // უზრუნველყოფს, რომ ყოველთვის ქეშიდან მოვა
    });
    const json = await res.json();
    if (json.errors) {
      console.error('WPGraphQL Error:', JSON.stringify(json.errors, null, 2));
      return null;
    }
    return json.data;
  } catch (error) {
    console.error('API Fetch Error:', error);
    return null;
  }
}

interface ProductFilters {
  category?: string;
  color?: string;
  material?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
}

export async function getProducts(filters: ProductFilters = {}, locale: string = 'ka'): Promise<Product[]> {
  const { category, color, material, minPrice, maxPrice, limit = 50 } = filters;

  const taxonomyFilter: any = { filters: [] };

  if (category && category !== 'all') {
    taxonomyFilter.filters.push({ taxonomy: 'PRODUCT_CAT', terms: [category] });
  }
  if (color && color !== 'all') {
    taxonomyFilter.filters.push({ taxonomy: 'PA_COLOR', terms: [color] });
  }
  if (material && material !== 'all') {
    taxonomyFilter.filters.push({ taxonomy: 'PA_MASALA', terms: [material] });
  }

  const whereArgs: any = {
    orderby: [{ field: 'DATE', order: 'DESC' }],
  };

  if (locale && locale !== 'all') {
     whereArgs.language = locale.toUpperCase();
  }

  if (taxonomyFilter.filters.length > 0) {
    whereArgs.taxonomyFilter = taxonomyFilter;
  }
  
  if (minPrice !== undefined || maxPrice !== undefined) {
    whereArgs.minPrice = minPrice;
    whereArgs.maxPrice = maxPrice;
  }

  const data = await fetchAPI(
    GET_PRODUCTS_QUERY, 
    { variables: { first: limit, where: whereArgs } }, 
    60 // 60 წამიანი ქეშირება პროდუქტებზე
  );

  return data?.products?.nodes || [];
}

export async function getFilters() {
  const data = await fetchAPI(GET_FILTERS_QUERY, {}, 86400); // 24 საათიანი ქეშირება ფილტრებზე
  return {
    categories: data?.productCategories?.nodes || [],
    colors: data?.allPaColor?.nodes || [],
    sizes: data?.allPaMasala?.nodes || [] 
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const data = await fetchAPI(GET_PRODUCT_BY_SLUG_QUERY, { variables: { id: slug } }, 3600); // 1 საათიანი ქეშირება
  return data?.product || null;
}