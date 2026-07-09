import { NextResponse } from 'next/server';
import { WORDPRESS_API_URL } from '@/lib/constants';
import { GET_PRODUCTS_QUERY } from '@/lib/queries';

/**
 * Locale-aware search index.
 * GET /api/search?locale=ka|en|ru
 *
 * Fetches products in the requested WP language only — so users on the EN site
 * never see Georgian-only products in search results, and vice-versa.
 *
 * Edge-cached per locale for 1 hour.
 */
export const revalidate = 3600;

const ALLOWED_LOCALES = new Set(['ka', 'en', 'ru']);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = (searchParams.get('locale') ?? 'ka').toLowerCase();
  const locale = ALLOWED_LOCALES.has(raw) ? raw : 'ka';
  const wpLang = locale.toUpperCase();

  try {
    // GET via the nginx-cached /graphql-cached endpoint so the search index
    // is served without booting WordPress (see lib/api.ts for the pattern).
    const params = new URLSearchParams({
      query: GET_PRODUCTS_QUERY,
      variables: JSON.stringify({ first: 500, where: { wpLang, status: 'PUBLISH' } }),
    });
    const cachedEndpoint = WORDPRESS_API_URL.replace(/\/graphql\/?$/, '/graphql-cached');
    const res = await fetch(`${cachedEndpoint}?${params.toString()}`, {
      method: 'GET',
      next: { revalidate: 3600, tags: [`products-search-${locale}`] },
    });

    const json = await res.json();
    if (json?.errors) console.error('search graphql errors', json.errors);

    const products = json?.data?.products?.nodes ?? [];

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
        'X-Search-Locale': locale,
      },
    });
  } catch (err) {
    console.error('search API error:', err);
    return NextResponse.json([], { status: 200 });
  }
}
