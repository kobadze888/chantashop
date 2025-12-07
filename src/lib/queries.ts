// src/lib/queries.ts

const PRODUCT_FRAGMENT = `
  fragment ProductFragment on Product {
    id
    databaseId
    name
    slug
    shortDescription
    description
    image {
      sourceUrl
      altText
    }
    language {
      code
    }
    productCategories {
      nodes {
        id
        name
        slug
      }
    }
    ... on SimpleProduct {
      price(format: RAW)
      regularPrice(format: RAW)
      salePrice(format: RAW)
      stockStatus
    }
    ... on VariableProduct {
      price(format: RAW)
      regularPrice(format: RAW)
      salePrice(format: RAW)
      stockStatus
      attributes {
        nodes {
          name
          label
          options
        }
      }
      variations {
        nodes {
          databaseId
          name
          price(format: RAW)
          regularPrice(format: RAW)
          salePrice(format: RAW)
          stockStatus
          image {
            sourceUrl
            altText
          }
          attributes {
            nodes {
              name
              value
            }
          }
        }
      }
    }
  }
`;

// ⚠️ ფილტრი ამოღებულია დროებით
export const GET_PRODUCTS_QUERY = `
  ${PRODUCT_FRAGMENT}
  query GetProducts($first: Int!) {
    products(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        ...ProductFragment
      }
    }
  }
`;

// ⚠️ ფილტრი ამოღებულია
export const GET_CATEGORIES_QUERY = `
  query GetCategories {
    productCategories(first: 20, where: { parent: 0, hideEmpty: true }) {
      nodes {
        id
        databaseId
        name
        slug
        count
        image {
          sourceUrl
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_SLUG_QUERY = `
  ${PRODUCT_FRAGMENT} 
  query GetProductBySlug($id: ID!) {
    product(id: $id, idType: SLUG) {
      ...ProductFragment
      galleryImages {
        nodes {
          sourceUrl
          altText
        }
      }
      seo {
        title
        metaDesc
      }
    }
  }
`;