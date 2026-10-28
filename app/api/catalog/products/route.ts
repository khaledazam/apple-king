import { NextRequest, NextResponse } from 'next/server';
import { getPublishedProducts } from '@/lib/catalog/queries';
import { parseAndValidateCatalogParams } from '@/lib/catalog/validation';
import { CACHE_POLICIES } from '@/lib/catalog/cache';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const validatedParams = parseAndValidateCatalogParams(searchParams);

    const data = await getPublishedProducts(validatedParams);

    return NextResponse.json(
      {
        status: 'success',
        data,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': CACHE_POLICIES.LISTING,
          'X-Content-Type-Options': 'nosniff',
        },
      }
    );
  } catch (error: any) {
    const isSecurityViolation = error?.message?.startsWith('Security Violation:');
    const statusCode = isSecurityViolation ? 400 : 500;
    const message = isSecurityViolation
      ? error.message
      : 'Failed to retrieve catalog products. Please try again.';

    return NextResponse.json(
      {
        status: 'error',
        message,
      },
      {
        status: statusCode,
      }
    );
  }
}
