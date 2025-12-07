// src/types/index.ts

export interface ProductImage {
  sourceUrl: string;
  altText?: string;
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
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  count?: number;
  image?: ProductImage;
}

export interface CartItem {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
  slug: string;
}