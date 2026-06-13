import { NextResponse } from 'next/server';
import { WORDPRESS_API_URL } from '@/lib/constants';

export const runtime = 'nodejs';

// Derive the WP REST endpoint from the GraphQL URL (…/graphql → …/wp-json/chantashop/v1/contact)
const CONTACT_ENDPOINT =
  WORDPRESS_API_URL.replace(/\/graphql\/?$/, '') + '/wp-json/chantashop/v1/contact';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body?.name ?? '').trim();
    const email = String(body?.email ?? '').trim();
    const phone = String(body?.phone ?? '').trim();
    const message = String(body?.message ?? '').trim();

    if (!name || !message) {
      return NextResponse.json({ success: false, error: 'missing_fields' }, { status: 400 });
    }
    if (message.length > 5000 || name.length > 200) {
      return NextResponse.json({ success: false, error: 'too_long' }, { status: 400 });
    }

    const res = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, message }),
      cache: 'no-store',
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.success) {
      return NextResponse.json({ success: false }, { status: 502 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
