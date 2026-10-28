import { NextResponse } from 'next/server';
import { getCatalogBrands } from '@/lib/catalog/queries';
import { CACHE_POLICIES } from '@/lib/catalog/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const brands = await getCatalogBrands();

    return NextResponse.json(
      {
        status: 'success',
        data: brands,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': CACHE_POLICIES.FILTERS,
          'X-Content-Type-Options': 'nosniff',
        },
      }
    );
  } catch (_error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to retrieve catalog brands',
      },
      { status: 500 }
    );
  }
}
