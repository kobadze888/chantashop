import { NextResponse } from 'next/server';
import { getProducts, getCategories } from '@/lib/api';

export async function GET() {
  const start = performance.now();
  
  try {
    const [products, categories] = await Promise.all([
      getProducts(5),
      getCategories()
    ]);

    const duration = performance.now() - start;

    return NextResponse.json({
      status: 'Connected 🟢',
      responseTime: `${duration.toFixed(2)}ms`,
      productsCount: products.length,
      categoriesCount: categories.length,
      sampleProduct: products[0] || 'No products found',
      sampleCategory: categories[0] || 'No categories found',
    });

  } catch (error) {
    return NextResponse.json({
      status: 'Failed 🔴',
      error: error instanceof Error ? error.message : 'Unknown Error'
    }, { status: 500 });
  }
}