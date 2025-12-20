// src/app/api/revalidate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');

  // 1. უსაფრთხოების შემოწმება (დარწმუნდით რომ ემთხვევა PHP-ს)
  if (secret !== 'MY_SECRET_TOKEN') {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  try {
    // 2. ვანახლებთ მთლიან საიტს ('layout' პარამეტრით)
    // ეს ასწორებს TypeScript-ის ერორს და ანახლებს ყველაფერს (მარაგს, ფასს)
    revalidatePath('/', 'layout');

    return NextResponse.json({ revalidated: true, now: Date.now(), type: 'all' });
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}

// POST მოთხოვნებისთვის
export async function POST(req: NextRequest) {
  return GET(req);
}