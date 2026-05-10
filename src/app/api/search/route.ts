import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/api';

/**
 * Search index: returns minimal product data for client-side fuzzy filtering.
 * Cached for 1 hour at the edge.
 */
export const revalidate = 3600;

export async function GET() {
  try {
    const products = await getProducts({ limit: 500 }, 'ka');

    const index = products.map((p: any) => ({
      id:           p.databaseId,
      name:         p.name,
      slug:         p.slug,
      image:        p.image?.sourceUrl ?? '/placeholder.jpg',
      price:        p.price ?? null,
      salePrice:    p.salePrice ?? null,
      regularPrice: p.regularPrice ?? null,
      categories:   (p.productCategories?.nodes ?? []).map((c: any) => c.name),
    }));

    return NextResponse.json(index, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
      },
    });
  } catch (err) {
    console.error('search API error:', err);
    return NextResponse.json([], { status: 200 });
  }
}
