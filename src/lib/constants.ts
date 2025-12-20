export const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL as string;

export const REVALIDATE_TIME = {
  PRODUCTS: 3600, // 1 საათი
  CATEGORIES: 86400, // 24 საათი
  SETTINGS: 604800, // 1 კვირა
};