// ფაილის გზა: src/lib/api.ts

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL as string;

// Common fetch function for GraphQL requests with ISR caching and language support
async function fetchAPI(query: string, { variables, locale }: { variables?: any, locale?: string } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  
  // Use language parameter for WPML/Polylang support in GraphQL
  // NOTE: We pass the language variable, but it is currently UNUSED in the GraphQL queries below
  // to avoid 'Field "lang" is not defined' errors until WP is fully configured for multilingual GraphQL.
  const finalVariables = { ...variables, language: locale?.toUpperCase() || 'KA' };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables: finalVariables }),
      next: { revalidate: 3600 }, // Cache for 1 hour (ISR)
    });

    const json = await res.json();
    
    if (json.errors) {
      console.error('GraphQL Errors:', json.errors);
      // We throw error only if the API call failed completely, but log errors if API returns data too.
      if (!json.data) throw new Error('Failed to fetch API');
    }
    return json.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Fetch a list of products
export async function getProducts(first = 20, locale: string) {
  // Removed ', where: {lang: $language}' from products query
  const data = await fetchAPI(`
    query GetProducts($first: Int!) {
      products(first: $first) { 
        nodes {
          id
          databaseId
          name
          slug
          description
          image {
            sourceUrl
            altText
          }
          ... on SimpleProduct {
            price
            regularPrice
            onSale
            salePrice
          }
          productCategories {
            nodes {
              name
              slug
            }
          }
          seo { 
            title
            metaDesc
            canonical
          }
        }
      }
    }
  `, { variables: { first }, locale });

  return data?.products?.nodes || [];
}

// Fetch product details by slug
export async function getProductBySlug(slug: string, locale: string) {
  // Removed 'language: $language' from product query
  const data = await fetchAPI(`
    query GetProductBySlug($slug: ID!) {
      product(id: $slug, idType: SLUG) {
        id
        databaseId
        name
        slug
        description
        shortDescription
        galleryImages {
          nodes {
            sourceUrl
            altText
          }
        }
        ... on SimpleProduct {
          price
          regularPrice
          onSale
          salePrice
          stockStatus
        }
        productCategories {
          nodes {
            name
            slug
          }
        }
        seo { 
          title
          metaDesc
          canonical
        }
      }
    }
  `, { variables: { slug }, locale });

  return data?.product;
}

// Fetch a list of product categories
export async function getProductCategories(first = 10, locale: string) {
  // Removed ', lang: $language' from productCategories query
  const data = await fetchAPI(`
    query GetProductCategories($first: Int!) {
      productCategories(where: {hideEmpty: true}, first: $first) {
        nodes {
          name
          slug
          image {
            sourceUrl
            altText
          }
          count
        }
      }
    }
  `, { variables: { first }, locale });

  return data?.productCategories?.nodes || [];
}

// Fetch menu links by location
export async function getMenu(location: string, locale: string) {
  // Removed ', language: $language' from menuItems query
  const data = await fetchAPI(`
    query GetMenu($location: MenuLocationEnum!) {
      menuItems(where: {location: $location}) {
        nodes {
          id
          label
          uri
          connectedObject {
            __typename
            ... on Page {
              slug
            }
            ... on ProductCategory {
              slug
            }
          }
        }
      }
    }
  `, { variables: { location }, locale });

  return data?.menuItems?.nodes || [];
}

// Fetch page content
export async function getPage(slug: string, locale: string) {
  // Removed ', language: $language' from page query
  const data = await fetchAPI(`
    query GetPage($slug: ID!) {
      page(id: $slug, idType: URI) {
        title
        content
        seo {
          title
          metaDesc
          canonical
          fullHead
        }
      }
    }
  `, { variables: { slug }, locale });

  return data?.page;
}