'use server';

import axios from 'axios';
import https from 'https';

const WP_URL = process.env.NEXT_PUBLIC_WP_URL;
const CK = process.env.WC_CONSUMER_KEY;
const CS = process.env.WC_CONSUMER_SECRET;
const BOG_CLIENT_ID = process.env.BOG_CLIENT_ID;
const BOG_SECRET = process.env.BOG_SECRET;

// 2. უსაფრთხოების შემოწმება
// თუ რომელიმე აკლია, სერვერი გაჩერდება და გეტყვის რა აკლია
if (!WP_URL || !CK || !CS || !BOG_CLIENT_ID || !BOG_SECRET) {
  console.error("❌ MISSING ENV VARIABLES:", { WP_URL, CK_Exists: !!CK, CS_Exists: !!CS, BOG_ID: !!BOG_CLIENT_ID, BOG_SECRET: !!BOG_SECRET });
  throw new Error("CRITICAL ERROR: Missing environment variables in .env file.");
}

export const processBogPayment = async (customerData: any, cartItems: any[], couponCode: string = '') => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  const agent = new https.Agent({ rejectUnauthorized: false, family: 4 });

  const wpConfig = {
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + Buffer.from(`${CK}:${CS}`).toString('base64')
    },
    httpsAgent: agent
  };

  try {
    console.log(`🔍 Starting Payment Process (Coupon: ${couponCode || 'None'})...`);

    // 1. საწყისი ფასების დათვლა (GROSS TOTAL)
    // ეს არის კუპონამდე არსებული ჯამი
    let grossSubtotal = 0;

    const orderItems = await Promise.all(cartItems.map(async (item: any) => {
      try {
        const productRes = await axios.get(`${WP_URL}/wp-json/wc/v3/products/${item.id}`, wpConfig);
        const realPrice = parseFloat(productRes.data.price) || 0;
        const quantity = parseInt(item.quantity);
        
        grossSubtotal += realPrice * quantity;

        return { product_id: item.id, quantity: quantity };
      } catch (err) {
        return { product_id: item.id, quantity: parseInt(item.quantity) };
      }
    }));

    // 2. 🚚 შიფინგის ლოგიკა (ეყრდნობა GROSS TOTAL-ს)
    // კუპონი აქ გავლენას ვერ ახდენს, რადგან grossSubtotal-ს ვამოწმებთ
    const city = (customerData.city || "").trim();
    const isTbilisi = /^(თბილისი|tbilisi|тбилиси)$/i.test(city);
    
    let shippingCost = 0;
    let shippingLabel = 'უფასო მიწოდება';

    // თუ კუპონამდე ჯამი >= 200, მიწოდება უფასოა!
    if (grossSubtotal >= 200) {
        shippingCost = 0;
        shippingLabel = 'უფასო მიწოდება (აქცია)';
    } else {
        if (isTbilisi) {
            shippingCost = 6;
            shippingLabel = 'მიწოდება თბილისში';
        } else {
            shippingCost = 10;
            shippingLabel = 'მიწოდება რეგიონში';
        }
    }

    console.log(`🚚 Shipping Calc: Gross=${grossSubtotal}, Cost=${shippingCost}`);

    // 3. WP Order Creation
    const wpOrderData: any = {
      payment_method: 'bog',
      payment_method_title: 'Bank of Georgia',
      set_paid: false,
      status: 'pending',
      billing: {
        first_name: customerData.firstName, last_name: customerData.lastName,
        address_1: customerData.address, city: customerData.city, 
        email: customerData.email, phone: customerData.phone, country: 'GE'
      },
      shipping: {
        first_name: customerData.firstName, last_name: customerData.lastName,
        address_1: customerData.address, city: customerData.city, 
        country: 'GE'
      },
      line_items: orderItems,
      shipping_lines: [
        {
          method_id: 'flat_rate',
          method_title: shippingLabel,
          total: shippingCost.toString() // ვაფიქსირებთ ჩვენს დათვლილ ფასს
        }
      ]
    };

    // კუპონის დამატება
    if (couponCode) {
        wpOrderData.coupon_lines = [ { code: couponCode } ];
    }

    // ვაგზავნით WooCommerce-ში (ახლა PHP აღარ შეუშლის ხელს!)
    const wpRes = await axios.post(`${WP_URL}/wp-json/wc/v3/orders`, wpOrderData, wpConfig);
    const createdOrder = wpRes.data;
    
    const orderId = createdOrder.id;
    // ვიღებთ ჯამს WC-დან (სადაც კუპონი დაკლებულია, მაგრამ შიფინგი ჩვენი დარჩა)
    const finalTotal = parseFloat(createdOrder.total); 
    const finalShipping = parseFloat(createdOrder.shipping_total);

    console.log(`✅ WP Order Created: #${orderId}. Total to Pay: ${finalTotal}`);

    // 4. Bank Token
    const authRes = await fetch('https://oauth2.bog.ge/auth/realms/bog/protocol/openid-connect/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${BOG_CLIENT_ID}:${BOG_SECRET}`).toString('base64'),
        'User-Agent': 'Mozilla/5.0'
      },
      body: 'grant_type=client_credentials',
      cache: 'no-store'
    });
    const authData = await authRes.json();
    const bankToken = authData.access_token;

    // 5. Payment Link
    const uniqueExternalId = `${orderId}-${Date.now()}`;

    // ბანკის კალათის აწყობა
    const bankBasket = createdOrder.line_items.map((item: any) => {
        const lineTotal = parseFloat(item.total);
        const quantity = parseInt(item.quantity);
        const unitPrice = lineTotal / quantity;

        return {
            quantity: quantity,
            unit_price: unitPrice.toFixed(2),
            product_id: String(item.product_id)
        };
    });

    // შიფინგის დამატება ბანკისთვის
    if (finalShipping > 0) {
        bankBasket.push({
            quantity: 1,
            unit_price: finalShipping.toFixed(2),
            product_id: "SHIPPING"
        });
    }

    const bankPayload = {
      callback_url: `https://chantashop.ge/api/bog-callback?wc_order_id=${orderId}`,
      external_order_id: uniqueExternalId,
      purchase_units: {
        currency: "GEL",
        total_amount: finalTotal.toFixed(2),
        basket: bankBasket
      },
      redirect_urls: {
        fail: `https://chantashop.ge/checkout/success?wc_order_id=${orderId}&status=fail`,
        success: `https://chantashop.ge/checkout/success?wc_order_id=${orderId}&status=success`
      }
    };

    const orderRes = await fetch('https://api.bog.ge/payments/v1/ecommerce/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${bankToken}`,
        'Content-Type': 'application/json',
        'Accept-Language': 'ka',
        'User-Agent': 'Mozilla/5.0'
      },
      body: JSON.stringify(bankPayload),
      cache: 'no-store'
    });

    const orderData = await orderRes.json();
    
    if (orderData.id) {
        try {
            await axios.put(`${WP_URL}/wp-json/wc/v3/orders/${orderId}`, {
                meta_data: [
                    { key: '_bog_transaction_id', value: orderData.id },
                    { key: '_bog_external_id', value: uniqueExternalId }
                ]
            }, wpConfig);
        } catch (saveErr) { console.error(saveErr); }
    }

    const redirectUrl = 
      orderData._links?.redirect?.href || 
      orderData.redirect_url || 
      orderData.links?.find((l:any) => l.rel === 'approve' || l.rel === 'redirect')?.href;

    if (redirectUrl) {
      return { success: true, redirectUrl };
    } else {
      throw new Error("Bank Error: " + JSON.stringify(orderData));
    }

  } catch (error: any) {
    console.error('🔥 FINAL ERROR:', error.message);
    return { success: false, error: error.message };
  }
};