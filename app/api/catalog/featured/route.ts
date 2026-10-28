import { NextRequest, NextResponse } from 'next/server';
import { getFeaturedProducts } from '@/lib/catalog/queries';
import { CACHE_POLICIES } from '@/lib/catalog/cache';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const rawLimit = request.nextUrl.searchParams.get('limit');
    const limit = rawLimit ? parseInt(rawLimit, 10) : 8;

    const featured = await getFeaturedProducts(limit);

    return NextResponse.json(
      {
        status: 'success',
        data: featured,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': CACHE_POLICIES.FEATURED,
          'X-Content-Type-Options': 'nosniff',
        },
      }
    );
  } catch (_error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to retrieve featured catalog products',
      },
      { status: 500 }
    );
  }
}
