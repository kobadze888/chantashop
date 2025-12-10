// src/lib/api.ts
import { WORDPRESS_API_URL } from './constants';
import { GET_PRODUCTS_QUERY, GET_FILTERS_QUERY, GET_PRODUCT_BY_SLUG_QUERY } from './queries';
import { Product } from '@/types';

async function fetchAPI(query: string, { variables }: { variables?: Record<string, any> } = {}, revalidateTime: number) {
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

export interface ProductFilters {
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

  const whereArgs: Record<string, any> = {};

  // Taxonomy Filter Structure for WPGraphQL
  const taxonomyFilter: { relation: string; filters: any[] } = { 
    relation: 'AND', 
    filters: [] 
  };

  if (category && category !== 'all') {
    taxonomyFilter.filters.push({ 
      taxonomy: 'PRODUCT_CAT', 
      terms: [category], 
      operator: 'IN'
    });
  }

  if (color && color !== 'all') {
    taxonomyFilter.filters.push({ 
      taxonomy: 'PA_COLOR', 
      terms: [color], 
      operator: 'IN'
    });
  }

  if (material && material !== 'all') {
    taxonomyFilter.filters.push({ 
      taxonomy: 'PA_MASALA', 
      terms: [material], 
      operator: 'IN'
    });
  }

  if (taxonomyFilter.filters.length > 0) {
    whereArgs.taxonomyFilter = taxonomyFilter;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    whereArgs.minPrice = minPrice;
    whereArgs.maxPrice = maxPrice;
  }

  // Sorting Logic
  switch (sort) {
    case 'POPULARITY_DESC':
      whereArgs.orderby = [{ field: 'TOTAL_SALES', order: 'DESC' }]; // Corrected field for popularity
      break;
    case 'PRICE_ASC':
      whereArgs.orderby = [{ field: 'PRICE', order: 'ASC' }];
      break;
    case 'PRICE_DESC':
      whereArgs.orderby = [{ field: 'PRICE', order: 'DESC' }];
      break;
    default: // DATE_DESC
      whereArgs.orderby = [{ field: 'DATE', order: 'DESC' }];
  }

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