// src/app/api/revalidate/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache'; 

// უნიკალური საიდუმლო ტოკენი უსაფრთხოებისთვის.
const REVALIDATION_TOKEN = process.env.REVALIDATION_TOKEN || 'YOUR_SECRET_FALLBACK_TOKEN'; 

/**
 * უნივერსალური ფუნქცია, რომელიც ამუშავებს როგორც GET, ასევე POST მოთხოვნებს.
 * WooCommerce Webhook-ები აგზავნიან POST-ს, მაგრამ პარამეტრები URL-შია.
 * ამიტომ, ლოგიკას ვამუშავებთ request.nextUrl.searchParams-დან.
 */
async function handleRevalidation(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug'); 
  const type = searchParams.get('type'); 

  // 1. ტოკენის შემოწმება უსაფრთხოებისთვის
  if (secret !== REVALIDATION_TOKEN) {
    console.error('Invalid revalidation token attempt');
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  try {
    if (type === 'filters') {
        // @ts-ignore - TS error fix
        revalidateTag('filters'); 
        console.log(`✅ Revalidation successful for tag: filters`);
        return NextResponse.json({ revalidated: true, now: Date.now(), tag: 'filters' });
    }
    
    if (type === 'collection') {
        // @ts-ignore - TS error fix
        revalidateTag('products');
        revalidatePath(`/`, 'page');
        revalidatePath(`/collection`, 'page');
        revalidatePath(`/shop`, 'page');
        console.log(`✅ Revalidation successful for collection/homepage`);
        return NextResponse.json({ revalidated: true, now: Date.now(), tag: 'products' });
    }

    if (type === 'product' && slug) {
        // @ts-ignore - TS error fix
        revalidateTag(`product-${slug}`); 
        // @ts-ignore - TS error fix
        revalidateTag('products'); 
        revalidatePath(`/product/${slug}`, 'page'); 
        
        console.log(`✅ Revalidation successful for product: ${slug}`);
        return NextResponse.json({ revalidated: true, now: Date.now(), path: `/product/${slug}` });
    }
    
    return NextResponse.json({ message: 'Missing type or slug parameter' }, { status: 400 });

  } catch (err) {
    console.error('❌ Revalidation Error:', err);
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}

// ✅ ექსპორტირებული GET ფუნქცია
export async function GET(request: NextRequest) {
  return handleRevalidation(request);
}

// ✅ ექსპორტირებული POST ფუნქცია (WooCommerce-ისთვის)
export async function POST(request: NextRequest) {
  return handleRevalidation(request);
}