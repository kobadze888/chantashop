const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL as string;

async function fetchAPI(query: string, { variables }: { variables?: any } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    const json = await res.json();
    
    if (json.errors) {
      console.error('GraphQL Errors:', json.errors);
      throw new Error('Failed to fetch API');
    }
    return json.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getProducts(first = 20) {
  const data = await fetchAPI(`
    query GetProducts($first: Int!) {
      products(first: $first) {
        nodes {
          id
          databaseId
          name
          slug
          image {
            sourceUrl
            altText
          }
          ... on SimpleProduct {
            price
            regularPrice
          }
          ... on VariableProduct {
            price
            regularPrice
          }
          productCategories {
            nodes {
              name
              slug
            }
          }
        }
      }
    }
  `, { variables: { first } });

  return data?.products?.nodes || [];
}