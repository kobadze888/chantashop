// src/lib/queries.ts

// ✅ ახალი ფრაგმენტი: მხოლოდ კატალოგისთვის საჭირო ველები
const PRODUCT_CARD_FRAGMENT = `
  fragment ProductCardFragment on Product {
    id
    databaseId
    name
    slug
    image { sourceUrl altText }
    productCategories { nodes { id name slug } }
    galleryImages(first: 1) { nodes { sourceUrl altText } }
    ... on SimpleProduct {
      price(format: RAW)
      regularPrice(format: RAW)
      salePrice(format: RAW)
      stockStatus
      stockQuantity
      attributes { 
        nodes { 
          name 
          options 
        } 
      }
    }
    ... on VariableProduct {
      price(format: RAW)
      regularPrice(format: RAW)
      salePrice(format: RAW)
      stockStatus
      stockQuantity
      image { sourceUrl altText }
      attributes { 
        nodes { 
          name 
          options 
        } 
      }
    }
  }
`;

// ძველი ფრაგმენტი: გამოიყენება მხოლოდ დეტალური გვერდისთვის
const PRODUCT_FRAGMENT = `
  fragment ProductFragment on Product {
    id
    databaseId
    name
    slug
    shortDescription
    description
    image { sourceUrl altText }
    language { code }
    productCategories { nodes { id name slug } }
    galleryImages { nodes { sourceUrl altText } }
    ... on SimpleProduct {
      price(format: RAW)
      regularPrice(format: RAW)
      salePrice(format: RAW)
      stockStatus
      stockQuantity
      attributes { 
        nodes { 
          name 
          label 
          options 
          ... on GlobalProductAttribute {
            terms { nodes { id name slug } } 
          }
        } 
      }
    }
    ... on VariableProduct {
      price(format: RAW)
      regularPrice(format: RAW)
      salePrice(format: RAW)
      stockStatus
      stockQuantity
      image { sourceUrl altText }
      attributes { 
        nodes { 
          name 
          label 
          options 
          ... on GlobalProductAttribute {
            terms { nodes { id name slug } } 
          }
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
          stockQuantity
          image { sourceUrl altText }
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

// ✅ ცვლილება: ვიყენებთ PRODUCT_CARD_FRAGMENT-ს პროდუქტების სიისთვის
export const GET_PRODUCTS_QUERY = `
  ${PRODUCT_CARD_FRAGMENT}
  query GetProducts($first: Int!, $where: RootQueryToProductUnionConnectionWhereArgs) {
    products(first: $first, where: $where) {
      nodes {
        ...ProductCardFragment
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_FILTERS_QUERY = `
  query GetFilters {
    productCategories(first: 1000, where: { hideEmpty: false }) {
      nodes { id name slug count safeLanguage }
    }
    allPaColor(first: 1000, where: { hideEmpty: true }) {
      nodes { id name slug count safeLanguage }
    }
    allPaMasala(first: 1000, where: { hideEmpty: true }) {
      nodes { id name slug count safeLanguage }
    }
  }
`;

// ✅ ცვლილება: ვიყენებთ PRODUCT_FRAGMENT-ს (სრულს) კონკრეტული პროდუქტის გვერდისთვის
export const GET_PRODUCT_BY_SLUG_QUERY = `
  ${PRODUCT_FRAGMENT} 
  query GetProductBySlug($id: ID!) {
    product(id: $id, idType: SLUG) {
      ...ProductFragment
      galleryImages { nodes { sourceUrl altText } }
      seo { title metaDesc }
    }
  }
`;

export const CHECKOUT_MUTATION = `
  mutation Checkout($input: CheckoutInput!) {
    checkout(input: $input) {
      order {
        databaseId
        orderNumber
        status
        total(format: RAW)
      }
      result
      redirect
    }
  }
`;

export const ADD_TO_CART_MUTATION = `
  mutation AddToCart($input: AddToCartInput!) {
    addToCart(input: $input) {
      cart {
        contents {
          itemCount
        }
      }
    }
  }
`;

export const APPLY_COUPON_MUTATION = `
  mutation ApplyCoupon($input: ApplyCouponInput!) {
    applyCoupon(input: $input) {
      cart {
        total(format: RAW)
      }
    }
  }
`;

export const UPDATE_CUSTOMER_MUTATION = `
  mutation UpdateCustomer($input: UpdateCustomerInput!) {
    updateCustomer(input: $input) {
      customer {
        shipping {
          city
          country
        }
      }
    }
  }
`;

export const GET_CART_TOTALS_QUERY = `
  query GetCartTotals {
    cart {
      total(format: RAW)
      subtotal(format: RAW)
      shippingTotal(format: RAW)
      discountTotal(format: RAW)
      appliedCoupons {
        code
        discountAmount(format: RAW)
      }
    }
  }
`;

export const GET_ORDER_QUERY = `
  query GetOrder($id: ID!) {
    order(id: $id, idType: DATABASE_ID) {
      databaseId
      orderNumber
      status
      date
      total(format: RAW)
      currency
      billing {
        firstName
        lastName
        city
        address1
        email 
      }
      lineItems {
        nodes {
          product {
            node {
              name
              image {
                sourceUrl
              }
            }
          }
          quantity
          total
        }
      }
    }
  }
`;