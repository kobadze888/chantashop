// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { getSitemapData } from '@/lib/api';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://chantashop.ge';
const locales = ['ka', 'en', 'ru'];

const excludePages = ['cart', 'checkout', 'my-account', 'order-received', 'success', 'track-order'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapData = await getSitemapData();

  const products = sitemapData?.products || [];
  const pages = sitemapData?.pages || [];
  // @ts-ignore
  const terms = sitemapData?.terms || []; // ✅ ყველა ტერმინი

  const sitemapEntries: MetadataRoute.Sitemap = [];

  const addEntry = (path: string, modifiedDate?: string, priority = 0.7, changeFreq: 'daily' | 'weekly' | 'monthly' = 'weekly') => {
    locales.forEach((locale) => {
      const localePath = locale === 'ka' ? '' : `/${locale}`;
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      let finalUrl = `${baseUrl}${localePath}${cleanPath}`;
      
      if (finalUrl.endsWith('/') && finalUrl !== baseUrl + '/') finalUrl = finalUrl.slice(0, -1);

      sitemapEntries.push({
        url: finalUrl,
        lastModified: modifiedDate ? new Date(modifiedDate) : new Date(),
        changeFrequency: changeFreq,
        priority: priority,
      });
    });
  };

  // 1. Pages
  pages.forEach((page: any) => {
    // 🛑 Yoast Check: თუ Noindex ჩართულია, გამოვტოვოთ
    if (page.seo?.metaRobotsNoindex === 'noindex') return;
    if (excludePages.includes(page.slug)) return;

    let path = page.slug;
    let priority = 0.8;

    if (path === 'home' || path === 'front-page' || path === 'mtavari') { path = '/'; priority = 1.0; }
    if (path.includes('shop') || path === 'collection' || path === 'full-catalog') { path = 'shop'; priority = 0.9; }
    
    addEntry(path, page.modified, priority, 'daily');
  });

  if (!pages.some((p: any) => p.slug.includes('shop'))) addEntry('/shop', undefined, 0.9, 'daily');

  // 2. Products
  products.forEach((product: any) => {
    if (product.seo?.metaRobotsNoindex === 'noindex') return;
    addEntry(`/product/${product.slug}`, product.modified, 0.9, 'weekly');
  });

  // 3. Dynamic Terms
  terms.forEach((term: any) => {
    // თუ ტერმინს აქვს noindex (და ჩვენ მოგვაქვს seo ველი), გამოვტოვოთ
    if (term.seo?.metaRobotsNoindex === 'noindex') return;

    const tax = term.taxonomyName; 

    // კატეგორიები
    if (tax === 'product_cat') {
      addEntry(`/product-category/${term.slug}`, undefined, 0.7, 'weekly');
    } 
    // ატრიბუტები (pa_...)
    else if (tax && tax.startsWith('pa_')) {
      const attrName = tax.replace('pa_', '');
      addEntry(`/${attrName}/${term.slug}`, undefined, 0.6, 'weekly');
    }
  });

  const uniqueEntries = Array.from(
    new Map(sitemapEntries.map((item) => [item.url, item])).values()
  );

  return uniqueEntries;
}