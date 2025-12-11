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

// ძირითადი Fetch ფუნქცია
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

// ... (getProducts და getFilters რჩება უცვლელი - შეგიძლიათ დატოვოთ ისე, როგორც იყო) ...
// მხოლოდ ჩასვით არსებული getProducts და getFilters კოდი აქ (ადგილი რომ არ დავიკავო, არ ვიმეორებ)

export async function getProducts(filters: any = {}, locale: string = 'ka'): Promise<Product[]> {
    // ... თქვენი არსებული getProducts კოდი ...
    // (დააკოპირეთ ძველი ფაილიდან)
    // აქ ცვლილება არ არის საჭირო, მთავარია SEO ფუნქციები დაემატოს ქვემოთ
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
    } else { whereArgs.orderby = [{ field: 'DATE', order: 'DESC' }]; }

    if (locale && locale !== 'all') whereArgs.language = locale.toUpperCase();

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

export async function getPageBySlug(slug: string) {
  const data = await fetchAPI(GET_PAGE_QUERY, { variables: { id: slug } }, 3600);
  return data?.page || null;
}

// ✅ ახალი: უნივერსალური SEO ფუნქცია
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