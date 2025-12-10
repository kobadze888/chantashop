// src/types/index.ts

export interface ProductImage {
  sourceUrl: string;
  altText?: string;
}

export interface Attribute {
  name: string;
  label?: string;
  options?: string[];
  value?: string;
  // ✅ დაემატა terms, რეალური სახელების წამოსაღებად
  terms?: {
    nodes: {
      id: string;
      name: string;
      slug: string;
    }[];
  };
}

export interface FilterTerm {
  id: string;
  name: string;
  slug: string;
  count?: number;
  safeLanguage?: string;
}

export interface Variation {
  databaseId: number;
  name: string;
  price: string;
  regularPrice?: string;
  salePrice?: string;
  stockStatus: string;
  image?: ProductImage;
  attributes?: { nodes: Attribute[] };
}

export interface Product {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  image: ProductImage;
  price: string;
  regularPrice?: string;
  salePrice?: string;
  stockStatus?: string;
  galleryImages?: { nodes: ProductImage[] };
  seo?: {
    title: string;
    metaDesc: string;
  };
  language?: { code: string };
  attributes?: { nodes: Attribute[] };
  variations?: { nodes: Variation[] };
  productCategories?: { nodes: FilterTerm[] };
}

export interface Category extends FilterTerm {
  image?: ProductImage;
}

export interface CartItem {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
  slug: string;
  selectedOptions?: Record<string, string>;
}