// src/lib/api.ts
import { WORDPRESS_API_URL } from './constants';
import { 
  GET_PRODUCTS_QUERY, 
  GET_FILTERS_QUERY, 
  GET_PRODUCT_BY_SLUG_QUERY, 
  GET_PAGE_QUERY, 
  GET_PAGE_BY_SLUG_NAME_QUERY, 
  GET_SHOP_PAGE_WITH_TRANSLATIONS,
  GET_SITEMAP_DATA_QUERY,
  TAXONOMY_SEO_FRAGMENT,
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

  if (revalidateTime === 0) fetchOptions.cache = 'no-store';
  else fetchOptions.next = { revalidate: revalidateTime };

  try {
    const res = await fetch(WORDPRESS_API_URL, fetchOptions);
    const json = await res.json();
    if (json.errors) {
      console.error('❌ WPGraphQL Error:', JSON.stringify(json.errors, null, 2));
      return null;
    }
    return json.data;
  } catch (error) {
    console.error('❌ API Network Error:', error);
    return null;
  }
}

function snakeToCamel(str: string) {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

export async function getProducts(filters: any = {}, locale: string = 'ka'): Promise<Product[]> {
  const { category, minPrice, maxPrice, limit = 50, sort = 'DATE_DESC', attributes } = filters;
  const whereArgs: any = {};
  
  if (locale && locale !== 'all') {
    whereArgs.language = locale.toUpperCase(); 
  }

  const taxonomyFilter: any = { relation: 'AND', filters: [] };

  if (category && category !== 'all') {
    taxonomyFilter.filters.push({ taxonomy: 'PRODUCT_CAT', terms: [category], operator: 'IN' });
  }

  if (attributes && Array.isArray(attributes)) {
    attributes.forEach((attr: any) => {
      taxonomyFilter.filters.push({
        taxonomy: attr.taxonomy,
        terms: attr.terms,
        operator: 'IN'
      });
    });
  }

  if (filters.color && filters.color !== 'all') {
    taxonomyFilter.filters.push({ taxonomy: 'PA_COLOR', terms: [filters.color], operator: 'IN' });
  }
  if (filters.material && filters.material !== 'all') {
    taxonomyFilter.filters.push({ taxonomy: 'PA_MASALA', terms: [filters.material], operator: 'IN' });
  }

  if (taxonomyFilter.filters.length > 0) {
    whereArgs.taxonomyFilter = taxonomyFilter;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    whereArgs.minPrice = minPrice;
    whereArgs.maxPrice = maxPrice;
  }

  if (sort) {
      if (sort === 'POPULARITY_DESC') whereArgs.orderby = [{ field: 'POPULARITY', order: 'DESC' }]; 
      else if (sort === 'PRICE_ASC') whereArgs.orderby = [{ field: 'PRICE', order: 'ASC' }];
      else if (sort === 'PRICE_DESC') whereArgs.orderby = [{ field: 'PRICE', order: 'DESC' }];
      else whereArgs.orderby = [{ field: 'DATE', order: 'DESC' }];
  } else {
      whereArgs.orderby = [{ field: 'DATE', order: 'DESC' }];
  }

  const data = await fetchAPI(GET_PRODUCTS_QUERY, { variables: { first: limit, where: whereArgs } }, 60);
  return data?.products?.nodes || [];
}

export async function getFilters(): Promise<{ categories: FilterTerm[]; colors: FilterTerm[]; sizes: FilterTerm[]; dynamicTerms: any[] } | null> {
  const data = await fetchAPI(GET_FILTERS_QUERY, {}, 86400);
  if (!data) return null;
  const allTerms = data.terms?.nodes || [];
  return {
    categories: data.productCategories?.nodes || [],
    colors: allTerms.filter((t: any) => t.taxonomyName === 'pa_color'),
    sizes: allTerms.filter((t: any) => t.taxonomyName === 'pa_masala'),
    dynamicTerms: allTerms
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const data = await fetchAPI(GET_PRODUCT_BY_SLUG_QUERY, { variables: { id: slug } }, 3600);
  return data?.product || null;
}

export async function getPageByUri(uri: string) {
  const data = await fetchAPI(GET_PAGE_QUERY, { variables: { id: uri } }, 3600);
  return data?.page || null;
}

export async function getPageBySlugReal(slug: string) {
  const data = await fetchAPI(GET_PAGE_BY_SLUG_NAME_QUERY, { variables: { slug: slug } }, 3600);
  return data?.pages?.nodes?.[0] || null;
}

export const getPageBySlug = getPageByUri;

export async function getShopSeo(locale: string) {
  const data = await fetchAPI(GET_SHOP_PAGE_WITH_TRANSLATIONS, {}, 3600);
  const mainShopPage = data?.pages?.nodes?.[0];
  if (!mainShopPage) return null;
  const targetLang = locale.toUpperCase();
  if (mainShopPage.language?.code === targetLang) return mainShopPage;
  const translation = mainShopPage.translations?.find((t: any) => t.language?.code === targetLang);
  return translation || mainShopPage;
}

// ✅ განახლებული: აბრუნებს კატეგორიებსაც და ტერმინებსაც
export async function getSitemapData() {
  const data = await fetchAPI(GET_SITEMAP_DATA_QUERY, {}, 3600);
  return {
    products: data?.products?.nodes || [],
    pages: data?.pages?.nodes || [],
    categories: data?.productCategories?.nodes || [], // SEO-თი
    terms: data?.terms?.nodes || [] // სხვა ატრიბუტები (SEO-ს გარეშე)
  };
}

export async function getTaxonomySeo(taxonomy: string, slug: string) {
  let graphQLField = '';
  
  if (taxonomy === 'category' || taxonomy === 'product_cat') graphQLField = 'productCategory';
  else if (taxonomy === 'color') graphQLField = 'paColor';
  else if (taxonomy === 'material') graphQLField = 'paMasala';
  else if (taxonomy === 'product_tag') graphQLField = 'productTag';
  else graphQLField = snakeToCamel(taxonomy); 

  const DYNAMIC_QUERY = `
    ${TAXONOMY_SEO_FRAGMENT}
    query GetDynamicTaxonomy($id: ID!) {
      ${graphQLField}(id: $id, idType: SLUG) {
        id
        name
        slug
        description
        seo { ...TaxonomySeoFragment }
      }
    }
  `;

  const data = await fetchAPI(DYNAMIC_QUERY, { variables: { id: slug } }, 3600);
  return data?.[graphQLField];
}