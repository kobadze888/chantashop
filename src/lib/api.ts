// src/lib/api.ts
import { WORDPRESS_API_URL } from './constants';
import { 
  GET_PRODUCTS_QUERY, GET_FILTERS_QUERY, GET_PRODUCT_BY_SLUG_QUERY, 
  GET_PAGE_QUERY, GET_PAGE_BY_SLUG_NAME_QUERY, GET_SHOP_PAGE_WITH_TRANSLATIONS,
  GET_SITEMAP_DATA_QUERY, TAXONOMY_SEO_FRAGMENT
} from './queries';
import { Product, FilterTerm } from '@/types';

export interface AttributeGroup { taxonomyName: string; label: string; terms: FilterTerm[]; }
interface FiltersData { categories: FilterTerm[]; attributes: AttributeGroup[]; highestPrice: number; }

async function fetchAPI(query: string, { variables }: { variables?: any } = {}, revalidateTime: number, tags: string[] = []) {
  const headers = { 'Content-Type': 'application/json' };
  const fetchOptions: RequestInit = {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  };
  if (tags.length > 0) fetchOptions.next = { tags, revalidate: revalidateTime };
  else if (revalidateTime === 0) fetchOptions.cache = 'no-store';
  else fetchOptions.next = { revalidate: revalidateTime };

  try {
    const res = await fetch(WORDPRESS_API_URL, fetchOptions);
    const json = await res.json();
    if (json.errors) {
      console.error('❌ WPGraphQL Error:', JSON.stringify(json.errors, null, 2));
      if (json.data) return json.data;
      return null;
    }
    return json.data;
  } catch (error) {
    console.error('❌ API Network Error:', error);
    return null;
  }
}

function snakeToCamel(str: string) { return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase()); }

export async function getProducts(filters: any = {}, locale: string = 'ka'): Promise<Product[]> {
  const { category, minPrice, maxPrice, limit = 50, sort = 'DATE_DESC', dynamicAttributes } = filters;
  const whereArgs: any = { wpLang: locale.toUpperCase() }; 

  const taxonomyFilter: any = { relation: 'AND', filters: [] };
  if (category && category !== 'all') {
    taxonomyFilter.filters.push({ taxonomy: 'PRODUCT_CAT', terms: [category], operator: 'IN' });
  }
  if (dynamicAttributes && Object.keys(dynamicAttributes).length > 0) {
    Object.entries(dynamicAttributes).forEach(([taxName, slugs]) => {
       if (slugs && (slugs as string) !== 'all') {
          taxonomyFilter.filters.push({ taxonomy: taxName.toUpperCase(), terms: Array.isArray(slugs) ? slugs : [slugs], operator: 'IN' });
       }
    });
  }
  if (taxonomyFilter.filters.length > 0) whereArgs.taxonomyFilter = taxonomyFilter;
  if (minPrice !== undefined || maxPrice !== undefined) { 
      whereArgs.minPrice = minPrice !== undefined ? Number(minPrice) : 0;
      whereArgs.maxPrice = maxPrice !== undefined ? Number(maxPrice) : 999999;
  }
  if (sort === 'PRICE_ASC') whereArgs.orderby = [{ field: 'PRICE', order: 'ASC' }];
  else if (sort === 'PRICE_DESC') whereArgs.orderby = [{ field: 'PRICE', order: 'DESC' }];
  else whereArgs.orderby = [{ field: 'DATE', order: 'DESC' }];

  const data = await fetchAPI(GET_PRODUCTS_QUERY, { variables: { first: limit, where: whereArgs } }, 3600, ['products']);
  return data?.products?.nodes || [];
}

export async function getFilters(locale: string = 'ka'): Promise<FiltersData | null> {
  const data = await fetchAPI(GET_FILTERS_QUERY, { variables: { wpLang: locale.toUpperCase() } }, 3600, ['filters']); 
  if (!data) return null;
  
  const allCategories = data.productCategories?.nodes || [];
  const allTerms = data.terms?.nodes || [];
  const groupedAttributes: Record<string, FilterTerm[]> = {};
  
  allTerms.forEach((term: any) => {
    if (['pa_color', 'pa_masala'].includes(term.taxonomyName)) {
        if (!groupedAttributes[term.taxonomyName]) groupedAttributes[term.taxonomyName] = [];
        groupedAttributes[term.taxonomyName].push(term);
    }
  });

  const attributes: AttributeGroup[] = Object.entries(groupedAttributes).map(([taxName, terms]) => {
      let label = (taxName === 'pa_color') ? 'ფერი' : (taxName === 'pa_masala' ? 'მასალა' : taxName.replace('pa_', ''));
      return { taxonomyName: taxName, label, terms };
  });

  let highestPrice = 5000;
  if (data.products?.nodes?.[0]?.price) {
      const parsed = parseFloat(data.products.nodes[0].price.replace(/[^0-9.]/g, ''));
      if (!isNaN(parsed)) highestPrice = Math.ceil(parsed);
  }
  return { categories: allCategories, attributes, highestPrice };
}

export async function getProductBySlug(slug: string, locale: string = 'ka'): Promise<Product | null> {
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
  return data?.pages?.nodes?.[0] || null;
}
export async function getSitemapData() {
  const data = await fetchAPI(GET_SITEMAP_DATA_QUERY, {}, 3600, ['sitemap']);
  return { products: data?.products?.nodes || [], pages: data?.pages?.nodes || [], terms: data?.terms?.nodes || [] };
}

export async function getTaxonomySeo(taxonomy: string, slug: string) {
  let graphQLField = '';
  
  // ✅ მკაცრი მეპინგი: ვამატებთ material-ის სწორ გადაყვანას paMasala-ზე
  if (taxonomy === 'category' || taxonomy === 'product_cat') {
    graphQLField = 'productCategory';
  } else if (taxonomy === 'pa_color' || taxonomy === 'color') {
    graphQLField = 'paColor';
  } else if (taxonomy === 'pa_masala' || taxonomy === 'masala' || taxonomy === 'material') {
    graphQLField = 'paMasala';
  } else {
    graphQLField = snakeToCamel(taxonomy); 
  }

  const DYNAMIC_QUERY = `${TAXONOMY_SEO_FRAGMENT} query GetDynamicTaxonomy($id: ID!) { ${graphQLField}(id: $id, idType: SLUG) { id name slug description seo { ...TaxonomySeoFragment } } }`;
  
  try {
    const data = await fetchAPI(DYNAMIC_QUERY, { variables: { id: slug } }, 3600, ['taxonomy']);
    return data?.[graphQLField];
  } catch (e) { 
    return null; 
  }
}