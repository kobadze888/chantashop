import { WORDPRESS_API_URL, REVALIDATE_TIME } from './constants';
import { GET_PRODUCTS_QUERY, GET_CATEGORIES_QUERY } from './queries';

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
      throw new Error('Failed to fetch API');
    }

    return json.data;
  } catch (error) {
    console.error('API Fetch Error:', error);
    return null;
  }
}

export async function getProducts(limit = 20) {
  const data = await fetchAPI(GET_PRODUCTS_QUERY, { variables: { first: limit } }, REVALIDATE_TIME.PRODUCTS);
  return data?.products?.nodes || [];
}

export async function getCategories() {
  const data = await fetchAPI(GET_CATEGORIES_QUERY, {}, REVALIDATE_TIME.CATEGORIES);
  return data?.productCategories?.nodes || [];
}