'use server';

import axios from 'axios';
import https from 'https';

const WP_URL = process.env.NEXT_PUBLIC_WP_URL;
const CK = process.env.WC_CONSUMER_KEY;
const CS = process.env.WC_CONSUMER_SECRET;

export const processBogPayment = async (customerData: any, cartItems: any[]) => {
  // SSL-ის გათიშვა ლოკალურად ამ ფუნქციისთვისაც
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  
  console.log("🔥 Payment Started: Force IPv4 (127.0.0.1)...");

  // ეს აგენტი არის გადამწყვეტი!
  const agent = new https.Agent({  
    rejectUnauthorized: false,
    family: 4 // <--- აიძულებს IPv4-ს (რადგან IPv6-ზე ერორს აგდებს)
  });

  const axiosConfig = {
    timeout: 30000,
    httpsAgent: agent,
    headers: { 
      'Content-Type': 'application/json',
      'User-Agent': 'ChantaShop-Server/1.0',
      'Authorization': 'Basic ' + Buffer.from(`${CK}:${CS}`).toString('base64')
    }
  };

  try {
    if (!CK || !CS) throw new Error("API Keys missing");

    const orderData = {
      payment_method: 'bog_headless',
      payment_method_title: 'Bank of Georgia',
      set_paid: false,
      billing: {
        first_name: customerData.firstName, last_name: customerData.lastName,
        address_1: customerData.address, address_2: customerData.apt,
        city: customerData.city, email: customerData.email, phone: customerData.phone, country: 'GE'
      },
      shipping: {
        first_name: customerData.firstName, last_name: customerData.lastName,
        address_1: customerData.address, city: customerData.city, country: 'GE'
      },
      line_items: cartItems.map((item: any) => ({ product_id: item.id, quantity: item.quantity }))
    };

    console.log("📝 Sending Order to WP...");
    
    // 1. შეკვეთა
    const orderRes = await axios.post(`${WP_URL}/wp-json/wc/v3/orders`, orderData, axiosConfig);
    const orderId = orderRes.data.id;
    console.log(`✅ Order Created: ${orderId}`);

    // 2. ლინკი
    console.log(`🔗 Requesting Link for #${orderId}...`);
    const initRes = await axios.post(
      `${WP_URL}/wp-json/wc-bog/v1/initiate`,
      { order_id: orderId },
      axiosConfig
    );

    console.log("🏦 Plugin Response:", JSON.stringify(initRes.data));

    if (initRes.data.status === 'success' && initRes.data.redirect_url) {
      return { success: true, redirectUrl: initRes.data.redirect_url };
    } else {
      return { success: false, error: `BOG Error: ${JSON.stringify(initRes.data)}` };
    }

  } catch (error: any) {
    console.error('🔥 FAILURE:', error.message);
    if(error.response) {
        console.error('Data:', JSON.stringify(error.response.data));
        return { success: false, error: `Server Error (${error.response.status}): ${JSON.stringify(error.response.data)}` };
    }
    return { success: false, error: error.message };
  }
};