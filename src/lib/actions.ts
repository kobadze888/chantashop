// src/lib/actions.ts
'use server';

import { WORDPRESS_API_URL } from './constants';
import { 
  ADD_TO_CART_MUTATION, 
  CHECKOUT_MUTATION, 
  APPLY_COUPON_MUTATION, 
  UPDATE_CUSTOMER_MUTATION, 
  GET_CART_TOTALS_QUERY 
} from './queries';

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

    const newSessionToken = res.headers.get('x-woocommerce-session');
    const altSessionToken = res.headers.get('woocommerce-session'); 
    const finalToken = newSessionToken || altSessionToken;

    const json = await res.json();
    
    return { 
      data: json.data, 
      errors: json.errors, 
      sessionToken: finalToken || sessionToken 
    };
  } catch (error) {
    return { errors: [{ message: error instanceof Error ? error.message : 'Network Error' }] };
  }
}

// ✅ ახალი ფუნქცია: მხოლოდ კალათის გადათვლა (კუპონით და მიწოდებით)
export async function calculateCartTotals(cartItems: any[], couponCode: string, city: string) {
  let currentSessionToken: string | undefined;

  // 1. ნივთების ჩაყრა
  for (const item of cartItems) {
    const res: any = await fetchWithSession(ADD_TO_CART_MUTATION, {
      input: {
        clientMutationId: generateMutationId(),
        productId: item.productId,
        quantity: item.quantity
      }
    }, currentSessionToken);
    
    if (res.sessionToken) currentSessionToken = res.sessionToken;
  }

  if (!currentSessionToken) return { errors: [{ message: "Session Error" }] };

  // 2. კუპონის გამოყენება (თუ არის)
  if (couponCode) {
    await fetchWithSession(APPLY_COUPON_MUTATION, {
      input: {
        clientMutationId: generateMutationId(),
        code: couponCode
      }
    }, currentSessionToken);
  }

  // 3. მისამართის განახლება (მიწოდების ფასისთვის)
  // თუ ქალაქი არჩეულია, ვაგზავნით მას
  if (city) {
    await fetchWithSession(UPDATE_CUSTOMER_MUTATION, {
      input: {
        clientMutationId: generateMutationId(),
        shipping: {
          city: city,
          country: 'GE'
        },
        billing: {
          city: city,
          country: 'GE'
        }
      }
    }, currentSessionToken);
  }

  // 4. საბოლოო მონაცემების წამოღება
  const cartRes: any = await fetchWithSession(GET_CART_TOTALS_QUERY, {}, currentSessionToken);

  return { 
    totals: cartRes.data?.cart, 
    sessionToken: currentSessionToken // ვაბრუნებთ ტოკენს, რომ ჩეკაუტმა გამოიყენოს
  };
}

// ✅ განახლებული შეკვეთის ფუნქცია
export async function placeOrder(orderInput: any, cartItems: any[], couponCode?: string, existingSession?: string) {
  // თუ უკვე გვაქვს calculateCartTotals-იდან დაბრუნებული სესია, ვიყენებთ მას.
  // თუ არა, თავიდან ვქმნით (ნაკლებად ოპტიმალურია, მაგრამ მუშაობს)
  let currentSessionToken = existingSession;

  if (!currentSessionToken) {
     // იგივე ლოგიკა კალათის შესავსებად...
     for (const item of cartItems) {
        const res: any = await fetchWithSession(ADD_TO_CART_MUTATION, {
          input: {
            clientMutationId: generateMutationId(),
            productId: item.productId,
            quantity: item.quantity
          }
        }, currentSessionToken);
        if (res.sessionToken) currentSessionToken = res.sessionToken;
     }
     
     if (couponCode) {
        await fetchWithSession(APPLY_COUPON_MUTATION, {
            input: { clientMutationId: generateMutationId(), code: couponCode }
        }, currentSessionToken);
     }
  }

  console.log("💳 Checkout with Token:", currentSessionToken);

  const res: any = await fetchWithSession(CHECKOUT_MUTATION, {
    input: {
      clientMutationId: generateMutationId(),
      ...orderInput
    }
  }, currentSessionToken);

  return res.data?.checkout || { errors: res.errors };
}