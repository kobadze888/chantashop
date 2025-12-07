// src/lib/api.ts
import { WORDPRESS_API_URL, REVALIDATE_TIME } from './constants';
import { GET_PRODUCTS_QUERY, GET_CATEGORIES_QUERY, GET_PRODUCT_BY_SLUG_QUERY } from './queries';
import { Product, Category } from '@/types';

async function fetchAPI(query: string, { variables }: { variables?: any } = {}, revalidateTime: number) {
  const headers = { 'Content-Type': 'application/json' };
  try {
    const res = await fetch(WORDPRESS_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
      next: { revalidate: revalidateTime },
    });
    const json = await res.json();
    if (json.errors) {
      console.error('WPGraphQL Error:', json.errors);
      return null;
    }
    return json.data;
  } catch (error) {
    console.error('API Fetch Error:', error);
    return null;
  }
}

export async function getProducts(limit = 100): Promise<Product[]> {
  const data = await fetchAPI(
    GET_PRODUCTS_QUERY, 
    { variables: { first: limit } }, 
    REVALIDATE_TIME.PRODUCTS
  );
  return data?.products?.nodes || [];
}

export async function getCategories(): Promise<Category[]> {
  const data = await fetchAPI(
    GET_CATEGORIES_QUERY, 
    {}, 
    REVALIDATE_TIME.CATEGORIES
  );
  return data?.productCategories?.nodes || [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const data = await fetchAPI(
    GET_PRODUCT_BY_SLUG_QUERY, 
    { variables: { id: slug } }, 
    REVALIDATE_TIME.PRODUCTS
  );
  return data?.product || null;
}