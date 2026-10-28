import { NextRequest, NextResponse } from 'next/server';
import { getProductAvailability } from '@/lib/catalog/queries';
import { validateSlug } from '@/lib/catalog/validation';
import { CACHE_POLICIES } from '@/lib/catalog/cache';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const { isValid, sanitized } = validateSlug(slug);

    if (!isValid) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid product slug format',
        },
        { status: 400 }
      );
    }

    const availability = await getProductAvailability(sanitized);

    if (!availability) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Product not found or unavailable in public catalog',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        status: 'success',
        data: availability,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': CACHE_POLICIES.AVAILABILITY,
          'X-Content-Type-Options': 'nosniff',
        },
      }
    );
  } catch (_error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to retrieve product availability',
      },
      { status: 500 }
    );
  }
}
