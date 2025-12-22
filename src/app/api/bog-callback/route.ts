import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const WP_URL = process.env.NEXT_PUBLIC_WP_URL;
const CK = process.env.WC_CONSUMER_KEY;
const CS = process.env.WC_CONSUMER_SECRET;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("🔔 Bank Callback Received:", JSON.stringify(body));

    // 1. ვიღებთ შეკვეთის ID-ს (ბანკი აბრუნებს external_order_id-ს, მაგ: "10218-173...")
    const externalId = body.order_id || body.external_order_id;
    if (!externalId) {
      return NextResponse.json({ error: "No Order ID" }, { status: 400 });
    }

    // ჩვენი ID არის ტირეზე (-) გაყოფილი, პირველი ნაწილია WP-ის ნომერი
    const wpOrderId = externalId.split('-')[0]; 
    const status = body.status || body.order_status;

    console.log(`Processing Order #${wpOrderId} with status: ${status}`);

    // 2. თუ სტატუსი არის "completed" ან "success" -> ვცვლით WooCommerce-ში
    if (status === 'completed' || status === 'success') {
      
      await axios.put(`${WP_URL}/wp-json/wc/v3/orders/${wpOrderId}`, 
        {
          status: 'processing', // "Processing" ნიშნავს გადახდილს
          set_paid: true,       // ესეც ადასტურებს გადახდას
          transaction_id: body.id // ბანკის ID-ს ვწერთ
        },
        {
          auth: { username: CK!, password: CS! }
        }
      );

      console.log(`✅ Order #${wpOrderId} marked as PAID/PROCESSING`);
    }

    return NextResponse.json({ status: "ok" });

  } catch (error: any) {
    console.error("Callback Error:", error.message);
    return NextResponse.json({ error: "Callback failed" }, { status: 500 });
  }
}