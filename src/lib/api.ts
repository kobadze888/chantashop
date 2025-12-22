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
} from './queries';
import { Product, FilterTerm } from '@/types';

export interface AttributeGroup {
  taxonomyName: string;
  label: string;
  terms: FilterTerm[];
}

interface FiltersData {
  categories: FilterTerm[];
  attributes: AttributeGroup[];
  highestPrice: number;
}

async function fetchAPI(query: string, { variables }: { variables?: any } = {}, revalidateTime: number, tags: string[] = []) {
  const headers = { 'Content-Type': 'application/json' };
  
  const fetchOptions: RequestInit = {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  };

  if (tags.length > 0) {
    fetchOptions.next = { tags, revalidate: revalidateTime }; 
  } else if (revalidateTime === 0) {
    fetchOptions.cache = 'no-store';
  } else {
    fetchOptions.next = { revalidate: revalidateTime };
  }

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
  const { category, minPrice, maxPrice, limit = 50, sort = 'DATE_DESC', dynamicAttributes } = filters;
  const whereArgs: any = {};
  
  // ✅ FIX: ენის ვალიდაცია
  const validLocales = ['ka', 'en', 'ru'];
  if (locale && validLocales.includes(locale) && locale !== 'all') {
    whereArgs.language = locale.toUpperCase(); 
  } else {
    whereArgs.language = 'KA'; // უსაფრთხო დეფოლტი
  }

  const taxonomyFilter: any = { relation: 'AND', filters: [] };

  if (category && category !== 'all') {
    taxonomyFilter.filters.push({ taxonomy: 'PRODUCT_CAT', terms: [category], operator: 'IN' });
  }

  if (dynamicAttributes && Object.keys(dynamicAttributes).length > 0) {
    Object.entries(dynamicAttributes).forEach(([taxName, slugs]) => {
       if (slugs && (slugs as string) !== 'all') {
          taxonomyFilter.filters.push({ 
             taxonomy: taxName.toUpperCase(),
             terms: [slugs], 
             operator: 'IN' 
          });
       }
    });
  }
  
  if (filters.color && filters.color !== 'all') taxonomyFilter.filters.push({ taxonomy: 'PA_COLOR', terms: [filters.color], operator: 'IN' });
  if (filters.material && filters.material !== 'all') taxonomyFilter.filters.push({ taxonomy: 'PA_MASALA', terms: [filters.material], operator: 'IN' });

  if (taxonomyFilter.filters.length > 0) whereArgs.taxonomyFilter = taxonomyFilter;
  
  if (minPrice !== undefined || maxPrice !== undefined) { 
      whereArgs.minPrice = minPrice !== undefined ? Number(minPrice) : 0;
      whereArgs.maxPrice = maxPrice !== undefined ? Number(maxPrice) : 999999;
  }

  if (sort) {
      if (sort === 'POPULARITY_DESC') whereArgs.orderby = [{ field: 'POPULARITY', order: 'DESC' }]; 
      else if (sort === 'PRICE_ASC') whereArgs.orderby = [{ field: 'PRICE', order: 'ASC' }];
      else if (sort === 'PRICE_DESC') whereArgs.orderby = [{ field: 'PRICE', order: 'DESC' }];
      else whereArgs.orderby = [{ field: 'DATE', order: 'DESC' }];
  } else {
      whereArgs.orderby = [{ field: 'DATE', order: 'DESC' }];
  }

  const data = await fetchAPI(GET_PRODUCTS_QUERY, { variables: { first: limit, where: whereArgs } }, 3600, ['products']);
  return data?.products?.nodes || [];
}

export async function getFilters(locale: string = 'ka'): Promise<FiltersData | null> {
  const langMap: Record<string, string> = { 'ka': 'KA', 'en': 'EN', 'ru': 'RU' };
  const queryLanguage = langMap[locale] || 'KA';

  const data = await fetchAPI(GET_FILTERS_QUERY, { variables: { language: queryLanguage } }, 3600, ['filters']); 
  if (!data) return null;
  
  const allCategories = data.productCategories?.nodes || [];
  const allTerms = data.terms?.nodes || [];
  
  const targetLang = locale.toUpperCase();

  const filteredCategories = allCategories.filter((cat: any) => {
      return !cat.language || cat.language.code === targetLang;
  });

  const groupedAttributes: Record<string, FilterTerm[]> = {};
  const allowedTaxonomies = ['pa_color', 'pa_masala'];

  allTerms.forEach((term: any) => {
    if (allowedTaxonomies.includes(term.taxonomyName)) {
        const termLang = term.language?.code;
        if (!termLang || termLang === targetLang) {
            if (!groupedAttributes[term.taxonomyName]) {
                groupedAttributes[term.taxonomyName] = [];
            }
            groupedAttributes[term.taxonomyName].push(term);
        }
    }
  });

  const attributes: AttributeGroup[] = Object.entries(groupedAttributes).map(([taxName, terms]) => {
      let label = '';
      if (taxName === 'pa_color') label = 'ფერი';
      else if (taxName === 'pa_masala') label = 'მასალა';
      else {
          label = taxName.replace('pa_', '');
          label = label.charAt(0).toUpperCase() + label.slice(1);
      }

      return { taxonomyName: taxName, label: label, terms: terms };
  });

  // ✅ მაქსიმალური ფასის გამოანგარიშება
  let highestPrice = 5000;
  if (data.products?.nodes?.[0]?.price) {
      const priceRaw = data.products.nodes[0].price;
      const parsed = parseFloat(priceRaw.replace(/[^0-9.]/g, ''));
      if (!isNaN(parsed)) highestPrice = Math.ceil(parsed);
  }

  return { categories: filteredCategories, attributes: attributes, highestPrice };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const data = await fetchAPI(GET_PRODUCT_BY_SLUG_QUERY, { variables: { id: slug } }, 3600, ['products']);
  return data?.product || null;
}

export async function getPageByUri(uri: string) {
  const data = await fetchAPI(GET_PAGE_QUERY, { variables: { id: uri } }, 3600, ['pages']);
  return data?.page || null;
}

export async function getPageBySlugReal(slug: string) {
  const data = await fetchAPI(GET_PAGE_BY_SLUG_NAME_QUERY, { variables: { slug: slug } }, 3600, ['pages']);
  return data?.pages?.nodes?.[0] || null;
}

export const getPageBySlug = getPageByUri;

export async function getShopSeo(locale: string) {
  const data = await fetchAPI(GET_SHOP_PAGE_WITH_TRANSLATIONS, {}, 3600, ['pages']);
  const mainShopPage = data?.pages?.nodes?.[0];
  if (!mainShopPage) return null;
  const targetLang = locale.toUpperCase();
  if (mainShopPage.language?.code === targetLang) return mainShopPage;
  const translation = mainShopPage.translations?.find((t: any) => t.language?.code === targetLang);
  return translation || mainShopPage;
}

export async function getSitemapData() {
  const data = await fetchAPI(GET_SITEMAP_DATA_QUERY, {}, 3600, ['sitemap']);
  return {
    products: data?.products?.nodes || [],
    pages: data?.pages?.nodes || [],
    terms: data?.terms?.nodes || []
  };
}

export async function getTaxonomySeo(taxonomy: string, slug: string) {
  let graphQLField = '';
  if (taxonomy === 'category' || taxonomy === 'product_cat') graphQLField = 'productCategory';
  else if (taxonomy.startsWith('pa_')) {
      if (taxonomy === 'pa_color') graphQLField = 'paColor';
      else if (taxonomy === 'pa_masala') graphQLField = 'paMasala';
      else graphQLField = snakeToCamel(taxonomy); 
  }
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

  try {
    const data = await fetchAPI(DYNAMIC_QUERY, { variables: { id: slug } }, 3600, ['taxonomy']);
    return data?.[graphQLField];
  } catch (e) {
      return null;
  }
}