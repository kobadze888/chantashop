export interface ProductImage {
  sourceUrl: string;
  altText?: string;
}

export interface Attribute {
  name: string;
  label?: string;
  options?: string[]; // მშობელ პროდუქტზე (ხელმისაწვდომი ოფციები)
  value?: string;     // ვარიაციაზე (კონკრეტული არჩეული მნიშვნელობა)
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
  // სპეციფიკური ველები ვარიაციული პროდუქტებისთვის
  attributes?: { nodes: Attribute[] };
  variations?: { nodes: Variation[] };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  count?: number;
  image?: ProductImage;
}

export interface CartItem {
  id: number; // ვარიაციის ID ან პროდუქტის ID
  name: string;
  price: string;
  image: string;
  quantity: number;
  slug: string;
  selectedOptions?: Record<string, string>; // მაგ: { Color: "Red" }
}