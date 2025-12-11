import { NextResponse } from 'next/server';
import { getProducts, getFilters } from '@/lib/api';

export async function GET() {
  const start = performance.now();
  
  try {
    const [products, filters] = await Promise.all([
      getProducts({ limit: 5 }),
      getFilters()
    ]);

    // ✅ FIX: უსაფრთხო შემოწმება (Null Check)
    const categories = filters ? filters.categories : [];

    const duration = performance.now() - start;

    return NextResponse.json({
      status: 'Connected 🟢',
      responseTime: `${duration.toFixed(2)}ms`,
      productsCount: products ? products.length : 0,
      categoriesCount: categories.length,
      sampleProduct: products && products.length > 0 ? products[0] : 'No products found',
      sampleCategory: categories.length > 0 ? categories[0] : 'No categories found',
    });

  } catch (error) {
    return NextResponse.json({
      status: 'Failed 🔴',
      error: error instanceof Error ? error.message : 'Unknown Error'
    }, { status: 500 });
  }
}