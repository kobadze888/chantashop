// src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

async function fetchAPI(query: string, { variables }: { variables?: any } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  
  // ISR (Incremental Static Regeneration) - ყოველ 1 საათში განახლდება კეში
  const res = await fetch(API_URL!, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 }, 
  });

  const json = await res.json();
  if (json.errors) {
    console.error('GraphQL Errors:', json.errors);
    throw new Error('Failed to fetch API');
  }
  return json.data;
}

// პროდუქტების წამოღება (Home Page-ისთვის)
export async function getProducts(first = 20, lang = 'KA') {
  // შენიშვნა: WooGraphQL-ს ენის მიხედვით ფილტრაცია სჭირდება თუ Polylang-ს იყენებ
  const data = await fetchAPI(`
    query GetProducts($first: Int!) {
      products(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
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
            price(format: FORMATTED)
            regularPrice(format: FORMATTED)
            salePrice(format: FORMATTED)
            onSale
          }
          ... on VariableProduct {
            price(format: FORMATTED)
            regularPrice(format: FORMATTED)
            salePrice(format: FORMATTED)
            onSale
          }
        }
      }
    }
  `, { variables: { first } });

  return data?.products?.nodes || [];
}

// კატეგორიების წამოღება
export async function getCategories() {
    const data = await fetchAPI(`
      query GetCategories {
        productCategories(first: 10, where: {parent: 0, hideEmpty: true}) {
          nodes {
            id
            name
            slug
            image {
              sourceUrl
            }
          }
        }
      }
    `);
    return data?.productCategories?.nodes || [];
}