// src/lib/api.ts
import { WORDPRESS_API_URL } from './constants';
import { GET_PRODUCTS_QUERY, GET_FILTERS_QUERY, GET_PRODUCT_BY_SLUG_QUERY } from './queries';
import { Product } from '@/types';

async function fetchAPI(query: string, { variables }: { variables?: any } = {}, revalidateTime: number) {
  const headers = { 'Content-Type': 'application/json' };
  
  const fetchOptions: RequestInit = {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  };

  if (revalidateTime === 0) {
    fetchOptions.cache = 'no-store';
  } else {
    fetchOptions.next = { revalidate: revalidateTime };
  }

  try {
    const res = await fetch(WORDPRESS_API_URL, fetchOptions);
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
  sort?: 'DATE_DESC' | 'PRICE_ASC' | 'PRICE_DESC' | 'POPULARITY_DESC'; 
}

export async function getProducts(filters: ProductFilters = {}, locale: string = 'ka'): Promise<Product[]> {
  const { category, color, material, minPrice, maxPrice, limit = 50, sort = 'DATE_DESC' } = filters;

  const whereArgs: any = {};

  // ✅ შესწორება: კატეგორია და ატრიბუტები ისევ ერთიან taxonomyFilter-შია
  // და წაიშალა field: 'SLUG' (რაც შეცდომას იწვევდა)
  const taxonomyFilter: any = { 
    relation: 'AND', 
    filters: [] 
  };

  // 1. კატეგორია (დაბრუნდა taxonomyFilter-ში)
  if (category && category !== 'all') {
    taxonomyFilter.filters.push({ 
      taxonomy: 'PRODUCT_CAT', 
      terms: [category], 
      operator: 'IN'
    });
  }

  // 2. ფერი
  if (color && color !== 'all') {
    taxonomyFilter.filters.push({ 
      taxonomy: 'PA_COLOR', 
      terms: [color], 
      operator: 'IN'
    });
  }

  // 3. მასალა
  if (material && material !== 'all') {
    taxonomyFilter.filters.push({ 
      taxonomy: 'PA_MASALA', 
      terms: [material], 
      operator: 'IN'
    });
  }

  // თუ ფილტრები დაემატა, ვამატებთ არგუმენტებში
  if (taxonomyFilter.filters.length > 0) {
    whereArgs.taxonomyFilter = taxonomyFilter;
  }

  // ფასის ფილტრი
  if (minPrice !== undefined || maxPrice !== undefined) {
    whereArgs.minPrice = minPrice;
    whereArgs.maxPrice = maxPrice;
  }

  // სორტირება
  if (sort) {
      if (sort === 'POPULARITY_DESC') whereArgs.orderby = [{ field: 'POPULARITY', order: 'DESC' }]; 
      else if (sort === 'PRICE_ASC') whereArgs.orderby = [{ field: 'PRICE', order: 'ASC' }];
      else if (sort === 'PRICE_DESC') whereArgs.orderby = [{ field: 'PRICE', order: 'DESC' }];
      else whereArgs.orderby = [{ field: 'DATE', order: 'DESC' }];
  } else {
      whereArgs.orderby = [{ field: 'DATE', order: 'DESC' }];
  }

  // ენის ფილტრი
  if (locale && locale !== 'all') {
      whereArgs.language = locale.toUpperCase();
  }

  const data = await fetchAPI(GET_PRODUCTS_QUERY, { variables: { first: limit, where: whereArgs } }, 60);
  return data?.products?.nodes || [];
}

export async function getFilters() {
  const data = await fetchAPI(GET_FILTERS_QUERY, {}, 86400);
  return {
    categories: data?.productCategories?.nodes || [],
    colors: data?.allPaColor?.nodes || [],
    sizes: data?.allPaMasala?.nodes || [] 
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const data = await fetchAPI(GET_PRODUCT_BY_SLUG_QUERY, { variables: { id: slug } }, 3600);
  return data?.product || null;
}