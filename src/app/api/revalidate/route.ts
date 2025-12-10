// src/app/api/revalidate/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache'; 

// უნიკალური საიდუმლო ტოკენი უსაფრთხოებისთვის.
const REVALIDATION_TOKEN = process.env.REVALIDATION_TOKEN || 'YOUR_SECRET_FALLBACK_TOKEN'; 

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug'); 
  const type = searchParams.get('type'); // product, collection, filters

  // 1. ტოკენის შემოწმება უსაფრთხოებისთვის
  if (secret !== REVALIDATION_TOKEN) {
    console.error('Invalid revalidation token attempt');
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  try {
    if (type === 'filters') {
        // ფილტრების განახლება (კატეგორიები, ფერები, მასალები)
        // @ts-ignore - TS error fix
        revalidateTag('filters'); 
        console.log(`✅ Revalidation successful for tag: filters`);
        return NextResponse.json({ revalidated: true, now: Date.now(), tag: 'filters' });
    }
    
    if (type === 'collection') {
        // კოლექციის და მთავარი გვერდის განახლება
        // @ts-ignore - TS error fix
        revalidateTag('products');
        revalidatePath(`/`, 'page');
        revalidatePath(`/collection`, 'page');
        revalidatePath(`/shop`, 'page'); // next-intl-ის როუტი
        console.log(`✅ Revalidation successful for collection/homepage`);
        return NextResponse.json({ revalidated: true, now: Date.now(), tag: 'products' });
    }

    // 2. პროდუქტის განახლება
    if (type === 'product' && slug) {
        // განვაახლოთ კონკრეტული პროდუქტის fetch ქეში
        // @ts-ignore - TS error fix
        revalidateTag(`product-${slug}`); 
        // განვაახლოთ ყველა პროდუქტის სია
        // @ts-ignore - TS error fix
        revalidateTag('products'); 
        // ასევე გავასუფთავოთ კონკრეტული გვერდის ქეში ყველა ლოკალისთვის
        revalidatePath(`/product/${slug}`, 'page'); 
        
        console.log(`✅ Revalidation successful for product: ${slug}`);
        return NextResponse.json({ revalidated: true, now: Date.now(), path: `/product/${slug}` });
    }
    
    // თუ არცერთი პარამეტრი არ არის მითითებული
    return NextResponse.json({ message: 'Missing type or slug parameter' }, { status: 400 });

  } catch (err) {
    console.error('❌ Revalidation Error:', err);
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}