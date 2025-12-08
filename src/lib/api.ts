// src/lib/api.ts

import { WORDPRESS_API_URL, REVALIDATE_TIME } from './constants';
import { GET_PRODUCTS_QUERY, GET_FILTERS_QUERY, GET_PRODUCT_BY_SLUG_QUERY } from './queries';
import { Product, Category } from '@/types';

const localeToEnum = (locale: string) => locale.toUpperCase();

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

export async function getProducts(limit = 20, locale: string = 'ka'): Promise<Product[]> {
  const data = await fetchAPI(
    GET_PRODUCTS_QUERY, 
    { 
      variables: { 
        first: limit,
        language: localeToEnum(locale)
      } 
    }, 
    REVALIDATE_TIME.PRODUCTS
  );
  return data?.products?.nodes || [];
}

export async function getFilters() {
  const data = await fetchAPI(
    GET_FILTERS_QUERY, 
    {}, 
    REVALIDATE_TIME.CATEGORIES
  );
  
  return {
    categories: data?.productCategories?.nodes || [],
    colors: data?.allPaColor?.nodes || [],
    // ⚠️ ყურადღება: რადგან ზომა არ გაქვთ, აქ ვაწვდით მასალას (pa_masala)
    // ეს გამოჩნდება საიტზე მეორე ფილტრად
    sizes: data?.allPaMasala?.nodes || [] 
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const data = await fetchAPI(
    GET_PRODUCT_BY_SLUG_QUERY, 
    { variables: { id: slug } }, 
    REVALIDATE_TIME.PRODUCTS
  );
  return data?.product || null;
}