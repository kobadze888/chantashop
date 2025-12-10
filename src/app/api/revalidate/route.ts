import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// უნიკალური საიდუმლო ტოკენი უსაფრთხოებისთვის.
// ის უნდა ემთხვეოდეს იმას, რასაც WooCommerce-ში ჩაწერთ.
const REVALIDATION_TOKEN = process.env.REVALIDATION_TOKEN || 'YOUR_SECRET_FALLBACK_TOKEN'; 

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug'); // WooCommerce-დან გადმოგვეცემა პროდუქტის slug

  // 1. ტოკენის შემოწმება უსაფრთხოებისთვის
  if (secret !== REVALIDATION_TOKEN) {
    console.error('Invalid revalidation token attempt');
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  // 2. სლაგის შემოწმება
  if (!slug) {
    return NextResponse.json({ message: 'Missing slug parameter' }, { status: 400 });
  }

  // Next.js-ში გზა, რომელიც ყველა ლოკალს მოიცავს (მაგ. /ka/product/test-slug)
  const path = `/product/${slug}`;
  
  try {
    // revalidatePath ანულებს ქეშს მოცემული დინამიური გზისთვის.
    // 'page' პარამეტრი უზრუნველყოფს, რომ ყველა ლოკალის ქეში გაუქმდეს.
    revalidatePath(path, 'page'); 
    
    console.log(`✅ Revalidation successful for path: ${path}`);
    
    return NextResponse.json({ revalidated: true, now: Date.now(), path: path });

  } catch (err) {
    console.error('❌ Revalidation Error:', err);
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}