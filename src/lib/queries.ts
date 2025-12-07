const PRODUCT_FRAGMENT = `
  fragment ProductFragment on Product {
    id
    databaseId
    name
    slug
    shortDescription
    image {
      sourceUrl
      altText
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
    }
  }
`;

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

export const GET_CATEGORIES_QUERY = `
  query GetCategories {
    productCategories(first: 20, where: { parent: 0, hideEmpty: true }) {
      nodes {
        id
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