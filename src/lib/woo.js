// src/lib/woo.js

const CK = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CS = process.env.WOOCOMMERCE_CONSUMER_SECRET;
const URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
const AUTH = `Basic ${btoa(`${CK}:${CS}`)}`;

const headers = {
  "Content-Type": "application/json",
  Authorization: AUTH,
};

// --- ფუნქცია 1: ატრიბუტებისთვის (ფერი, მასალა და ა.შ.) ---
export async function getProductsByDynamicAttribute(attributeName, termSlug) {
  try {
    const wcAttributeSlug = `pa_${attributeName}`; 

    // 1. ვიპოვოთ ატრიბუტის ID
    const attrRes = await fetch(`${URL}/wp-json/wc/v3/products/attributes?slug=${wcAttributeSlug}`, { headers });
    const attributes = await attrRes.json();
    
    if (!attributes || attributes.length === 0) return null;
    
    const attributeId = attributes[0].id;
    const attributeLabel = attributes[0].name;

    // 2. ვიპოვოთ ტერმინის ID
    const termRes = await fetch(`${URL}/wp-json/wc/v3/products/attributes/${attributeId}/terms?slug=${termSlug}`, { headers });
    const terms = await termRes.json();

    if (!terms || terms.length === 0) return null;
    
    const termId = terms[0].id;
    const termName = terms[0].name;

    // 3. წამოვიღოთ პროდუქტები
    const prodRes = await fetch(`${URL}/wp-json/wc/v3/products?attribute=${wcAttributeSlug}&attribute_term=${termId}`, { 
      headers,
      next: { revalidate: 60 } 
    });

    const products = await prodRes.json();
    
    return { attributeLabel, termName, products };

  } catch (error) {
    console.error("API Error (Attributes):", error);
    return null;
  }
}

// --- ფუნქცია 2: კატეგორიებისთვის ---
export async function getProductsByCategorySlug(slug) {
  try {
    // 1. ვიპოვოთ კატეგორიის ID სლაგის მიხედვით
    const catRes = await fetch(`${URL}/wp-json/wc/v3/products/categories?slug=${slug}`, { headers });
    const categories = await catRes.json();

    if (!categories || categories.length === 0) return null;

    const categoryId = categories[0].id;
    const categoryName = categories[0].name;

    // 2. წამოვიღოთ პროდუქტები ამ ID-ით
    const prodRes = await fetch(`${URL}/wp-json/wc/v3/products?category=${categoryId}`, { 
      headers,
      next: { revalidate: 60 }
    });
    
    const products = await prodRes.json();
    return { categoryName, products };

  } catch (error) {
    console.error("API Error (Category):", error);
    return null;
  }
}