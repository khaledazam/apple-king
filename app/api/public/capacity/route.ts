import { NextResponse } from 'next/server';
import { getCatalogFilters } from '@/lib/catalog/queries';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const filters = await getCatalogFilters();
    return NextResponse.json({
      status: 'success',
      data: filters.storages || [],
    });
  } catch {
    return NextResponse.json({
      status: 'success',
      data: [],
    });
  }
}
