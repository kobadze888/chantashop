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
      attributes {
        nodes {
          name
          label
          options
        }
      }
    }
    ... on VariableProduct {
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

// ✅ პროდუქტებს ისევ ვფილტრავთ ენით (სწორი მეთოდი)
export const GET_PRODUCTS_QUERY = `
  ${PRODUCT_FRAGMENT}
  query GetProducts($first: Int!, $language: LanguageCodeFilterEnum!) {
    products(first: $first, where: { language: $language, orderby: { field: DATE, order: DESC } }) {
      nodes {
        ...ProductFragment
      }
    }
  }
`;

// ✅ კატეგორიებს ვიღებთ სრულად (hideEmpty: false), რომ YSL (1) არ დაიმალოს
export const GET_FILTERS_QUERY = `
  query GetFilters {
    productCategories(first: 1000, where: { hideEmpty: false }) {
      nodes {
        id
        name
        slug
        count
        safeLanguage
        image {
          sourceUrl
        }
      }
    }
    allPaColor(first: 1000, where: { hideEmpty: true }) {
      nodes {
        id
        name
        slug
        count
        safeLanguage
      }
    }
    allPaMasala(first: 1000, where: { hideEmpty: true }) {
      nodes {
        id
        name
        slug
        count
        safeLanguage
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