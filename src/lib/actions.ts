// src/lib/actions.ts
'use server';

import { WORDPRESS_API_URL } from './constants';
import { ADD_TO_CART_MUTATION, CHECKOUT_MUTATION } from './queries';

// უნიკალური ID-ს გენერატორი
const generateMutationId = () => Math.random().toString(36).substring(7);

async function fetchWithSession(query: string, variables: any, sessionToken?: string) {
  const headers: any = { 'Content-Type': 'application/json' };
  
  if (sessionToken) {
    headers['woocommerce-session'] = `Session ${sessionToken}`;
  }

  try {
    const res = await fetch(WORDPRESS_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
      cache: 'no-store',
    });

    // 🔍 Debug: ჰედერების შემოწმება
    const newSessionToken = res.headers.get('x-woocommerce-session');
    
    // ზოგიერთი სერვერი აბრუნებს 'woocommerce-session'-ს 'x-'-ის გარეშე
    const altSessionToken = res.headers.get('woocommerce-session'); 
    
    const finalToken = newSessionToken || altSessionToken;

    const json = await res.json();
    
    return { 
      data: json.data, 
      errors: json.errors, 
      sessionToken: finalToken || sessionToken // თუ ახალი არ მოვიდა, ვიყენებთ ძველს
    };
  } catch (error) {
    return { errors: [{ message: error instanceof Error ? error.message : 'Network Error' }] };
  }
}

export async function placeOrder(orderInput: any, cartItems: any[]) {
  let currentSessionToken: string | undefined;

  console.log("🚀 Starting Server-Side Order Process...");
  console.log(`📦 Cart Items to add: ${cartItems.length}`);

  // 1. კალათის შევსება
  for (const [index, item] of cartItems.entries()) {
    console.log(`🔹 Adding item ${index + 1}/${cartItems.length} (ID: ${item.productId})`);
    
    const res: any = await fetchWithSession(ADD_TO_CART_MUTATION, {
      input: {
        clientMutationId: generateMutationId(), // ✅ აუცილებელია უნიკალურობისთვის
        productId: item.productId,
        quantity: item.quantity
      }
    }, currentSessionToken);

    if (res.errors) {
      console.error("❌ Cart Error for item:", item.productId, JSON.stringify(res.errors, null, 2));
      return { errors: res.errors };
    }
    
    // 🔍 Debug Log
    if (res.sessionToken) {
        console.log(`✅ Session Token Received: ${res.sessionToken.substring(0, 10)}...`);
        currentSessionToken = res.sessionToken;
    } else {
        console.warn(`⚠️ Warning: No session token returned for item ${item.productId}`);
    }
  }

  // 2. Checkout
  if (!currentSessionToken) {
    console.error("❌ Critical: Session Token is missing after adding items.");
    return { errors: [{ message: "სესიის შექმნა ვერ მოხერხდა. გთხოვთ, სცადოთ მოგვიანებით ან დაუკავშირდეთ ადმინისტრაციას." }] };
  }

  console.log("💳 Proceeding to Checkout with Token...");

  const res: any = await fetchWithSession(CHECKOUT_MUTATION, {
    input: {
      clientMutationId: generateMutationId(),
      ...orderInput
    }
  }, currentSessionToken);

  if (res.errors) {
      console.error("❌ Checkout API Error:", JSON.stringify(res.errors, null, 2));
  }

  return res.data?.checkout || { errors: res.errors };
}