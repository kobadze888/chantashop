'use server';

import axios from 'axios';
import https from 'https';

// შენი კოდები (პირდაპირ აქ, რომ შეცდომა არ მოხდეს)
const CLIENT_ID = '46442';
const CLIENT_SECRET = 'Rn1jknnySnQ3'; // შენი Secret Key
const CALLBACK_URL = 'https://chantashop.ge/checkout/success'; // ან რაც გაქვს

// ბანკის ახალი მისამართები (სადაც curl-მა იმუშავა)
const AUTH_URL = 'https://oauth2.bog.ge/auth/realms/bog/protocol/openid-connect/token';
const ORDER_URL = 'https://api.bog.ge/payments/v1/ecommerce/orders';

export const processBogPayment = async (customerData: any, cartItems: any[]) => {
  console.log("🔥 Starting Direct BOG Payment...");

  // SSL-ის პრობლემების თავიდან აცილება
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  const agent = new https.Agent({ rejectUnauthorized: false, family: 4 });

  try {
    // 1. ტოკენის აღება (ის რაც curl-ით გააკეთე)
    console.log("🔑 Getting Access Token...");
    
    const tokenParams = new URLSearchParams();
    tokenParams.append('grant_type', 'client_credentials');

    const authRes = await axios.post(AUTH_URL, tokenParams, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
      },
      httpsAgent: agent
    });

    const accessToken = authRes.data.access_token;
    console.log("✅ Token Received!");

    // 2. შეკვეთის შექმნა
    console.log("📝 Creating Bank Order...");

    const totalAmount = cartItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0).toFixed(2);

    const orderBody = {
      callback_url: CALLBACK_URL,
      redirect_url: CALLBACK_URL, // მომხმარებელი აქ დაბრუნდება
      order_amount: totalAmount,
      currency: "GEL",
      shop_order_id: `ORDER-${Date.now()}`, // უნიკალური ID
      purchase_desc: "ChantaShop Order",
      capture_method: "AUTOMATIC"
    };

    const orderRes = await axios.post(ORDER_URL, orderBody, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      httpsAgent: agent
    });

    // 3. შედეგის დაბრუნება
    console.log("🏦 Order Created:", orderRes.data);
    
    // ბანკი აბრუნებს `_links.redirect.href`-ს ან მსგავსს.
    // ახალი API-ს სტრუქტურა:
    const redirectUrl = orderRes.data._links?.redirect?.href || orderRes.data.redirect_url;

    if (redirectUrl) {
        return { success: true, redirectUrl: redirectUrl };
    } else {
        return { success: false, error: "Bank did not return redirect URL" };
    }

  } catch (error: any) {
    console.error('🔥 ERROR:', error.message);
    if(error.response) console.error('Data:', JSON.stringify(error.response.data));
    return { success: false, error: `Payment Failed: ${error.message}` };
  }
};