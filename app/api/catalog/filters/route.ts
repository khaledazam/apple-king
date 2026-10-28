import { NextResponse } from 'next/server';
import { getCatalogFilters } from '@/lib/catalog/queries';
import { CACHE_POLICIES } from '@/lib/catalog/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const filters = await getCatalogFilters();

    return NextResponse.json(
      {
        status: 'success',
        data: filters,
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
        message: 'Failed to retrieve catalog filter options',
      },
      { status: 500 }
    );
  }
}
