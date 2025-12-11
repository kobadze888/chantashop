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
  terms?: {
    nodes: {
      id: string;
      name: string;
      slug: string;
    }[];
  };
}

// ✅ განახლებული: SEO ინტერფეისი სრული ველებით
export interface SEO {
  title: string;
  metaDesc: string;
  opengraphTitle?: string;
  opengraphDescription?: string;
  opengraphImage?: {
    sourceUrl: string;
  };
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: {
    sourceUrl: string;
  };
  canonical?: string;
}

export interface FilterTerm {
  id: string;
  name: string;
  slug: string;
  count?: number;
  safeLanguage?: string;
  description?: string; // ✅ დაემატა description
  seo?: SEO; // ✅ დაემატა SEO ფილტრებისთვის (კატეგორია/ატრიბუტი)
}

export interface Variation {
  databaseId: number;
  name: string;
  price: string;
  regularPrice?: string;
  salePrice?: string;
  stockStatus: string;
  stockQuantity?: number;
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
  stockQuantity?: number;
  galleryImages?: { nodes: ProductImage[] };
  seo?: SEO; // ✅ განახლებული SEO ტიპი
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
  stockQuantity?: number;
}