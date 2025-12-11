// src/lib/api.ts
import { WORDPRESS_API_URL } from './constants';
import { 
  GET_PRODUCTS_QUERY, 
  GET_FILTERS_QUERY, 
  GET_PRODUCT_BY_SLUG_QUERY, 
  GET_PAGE_QUERY, 
  GET_CATEGORY_SEO_QUERY,
  GET_COLOR_SEO_QUERY,
  GET_MATERIAL_SEO_QUERY
} from './queries';
import { Product, FilterTerm } from '@/types';

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
    
    // 🛑 შეცდომების ლოგირება (ტერმინალში გამოჩნდება)
    if (json.errors) {
      console.error('❌ WPGraphQL Error:', JSON.stringify(json.errors, null, 2));
      // თუ SEO ველების პრობლემაა, ვაბრუნებთ null-ს
      return null;
    }
    return json.data;
  } catch (error) {
    console.error('❌ API Network Error:', error);
    return null;
  }
}

// 1. პროდუქტების წამოღება (ენის ფილტრის გარეშე, სტაბილურობისთვის)
export async function getProducts(filters: any = {}, locale: string = 'ka'): Promise<Product[]> {
  const { category, color, material, minPrice, maxPrice, limit = 50, sort = 'DATE_DESC' } = filters;

  const whereArgs: any = {};
  const taxonomyFilter: any = { relation: 'AND', filters: [] };

  if (category && category !== 'all') taxonomyFilter.filters.push({ taxonomy: 'PRODUCT_CAT', terms: [category], operator: 'IN' });
  if (color && color !== 'all') taxonomyFilter.filters.push({ taxonomy: 'PA_COLOR', terms: [color], operator: 'IN' });
  if (material && material !== 'all') taxonomyFilter.filters.push({ taxonomy: 'PA_MASALA', terms: [material], operator: 'IN' });

  if (taxonomyFilter.filters.length > 0) whereArgs.taxonomyFilter = taxonomyFilter;
  if (minPrice !== undefined || maxPrice !== undefined) { whereArgs.minPrice = minPrice; whereArgs.maxPrice = maxPrice; }

  if (sort) {
      if (sort === 'POPULARITY_DESC') whereArgs.orderby = [{ field: 'POPULARITY', order: 'DESC' }]; 
      else if (sort === 'PRICE_ASC') whereArgs.orderby = [{ field: 'PRICE', order: 'ASC' }];
      else if (sort === 'PRICE_DESC') whereArgs.orderby = [{ field: 'PRICE', order: 'DESC' }];
      else whereArgs.orderby = [{ field: 'DATE', order: 'DESC' }];
  } else {
      whereArgs.orderby = [{ field: 'DATE', order: 'DESC' }];
  }

  // ⚠️ ენის ფილტრი გავთიშეთ, რადგან Polylang-თან კონფლიქტში არ მოვიდეს
  // whereArgs.language = locale.toUpperCase();

  const data = await fetchAPI(GET_PRODUCTS_QUERY, { variables: { first: limit, where: whereArgs } }, 60);
  return data?.products?.nodes || [];
}

export async function getFilters(): Promise<{ categories: FilterTerm[]; colors: FilterTerm[]; sizes: FilterTerm[] } | null> {
  const data = await fetchAPI(GET_FILTERS_QUERY, {}, 86400);
  if (!data) return null;
  return {
    categories: data.productCategories?.nodes || [],
    colors: data.allPaColor?.nodes || [],
    sizes: data.allPaMasala?.nodes || [] 
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const data = await fetchAPI(GET_PRODUCT_BY_SLUG_QUERY, { variables: { id: slug } }, 3600);
  return data?.product || null;
}

// 2. გვერდის მონაცემები (SEO-სთვის)
export async function getPageByUri(uri: string) {
  const data = await fetchAPI(GET_PAGE_QUERY, { variables: { id: uri } }, 3600);
  return data?.page || null;
}

// ✅ ალიასი, რომ ბილდი არ გავარდეს
export const getPageBySlug = getPageByUri; 

// 3. ტაქსონომიის SEO (კატეგორია/ფერი)
export async function getTaxonomySeo(taxonomy: 'category' | 'color' | 'material', slug: string) {
  let query = '';
  switch (taxonomy) {
    case 'category': query = GET_CATEGORY_SEO_QUERY; break;
    case 'color': query = GET_COLOR_SEO_QUERY; break;
    case 'material': query = GET_MATERIAL_SEO_QUERY; break;
  }
  const data = await fetchAPI(query, { variables: { id: slug } }, 3600);
  
  if (taxonomy === 'category') return data?.productCategory;
  if (taxonomy === 'color') return data?.paColor;
  if (taxonomy === 'material') return data?.paMasala;
  return null;
}