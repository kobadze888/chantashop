// src/lib/actions.ts
'use server';

import { WORDPRESS_API_URL } from './constants';
import { 
  ADD_TO_CART_MUTATION, 
  CHECKOUT_MUTATION, 
  APPLY_COUPON_MUTATION, 
  UPDATE_CUSTOMER_MUTATION, 
  GET_CART_TOTALS_QUERY,
  GET_ORDER_QUERY 
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

export async function calculateCartTotals(cartItems: any[], couponCode: string, city: string) {
  let currentSessionToken: string | undefined;

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

  if (couponCode) {
    await fetchWithSession(APPLY_COUPON_MUTATION, {
      input: {
        clientMutationId: generateMutationId(),
        code: couponCode
      }
    }, currentSessionToken);
  }

  if (city) {
    await fetchWithSession(UPDATE_CUSTOMER_MUTATION, {
      input: {
        clientMutationId: generateMutationId(),
        shipping: { city: city, country: 'GE' },
        billing: { city: city, country: 'GE' }
      }
    }, currentSessionToken);
  }

  const cartRes: any = await fetchWithSession(GET_CART_TOTALS_QUERY, {}, currentSessionToken);

  return { 
    totals: cartRes.data?.cart, 
    sessionToken: currentSessionToken 
  };
}

export async function placeOrder(orderInput: any, cartItems: any[], couponCode?: string, existingSession?: string) {
  let currentSessionToken = existingSession;

  if (!currentSessionToken) {
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

// ✅ ახალი: შეკვეთის მოძებნა ID-ით
export async function getOrder(orderId: string) {
  // ვიყენებთ fetchWithSession-ს ტოკენის გარეშე (Public Query)
  const res: any = await fetchWithSession(GET_ORDER_QUERY, { id: orderId });
  return res.data?.order || null;
}