import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlug } from '@/lib/catalog/queries';
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

    const product = await getProductBySlug(sanitized);

    // Section 6: If product does not exist or is unpublished, strictly return 404
    if (!product) {
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
        data: product,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': CACHE_POLICIES.DETAIL,
          'X-Content-Type-Options': 'nosniff',
        },
      }
    );
  } catch (_error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'An error occurred while fetching product details',
      },
      { status: 500 }
    );
  }
}
