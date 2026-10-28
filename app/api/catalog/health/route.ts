import { NextResponse } from 'next/server';
import { pingStorefrontDb } from '@/lib/db/mongodb';
import { CACHE_POLICIES } from '@/lib/catalog/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  const dbHealth = await pingStorefrontDb();

  // Minimal public health information: no database URLs, hostnames, passwords, or sync queues exposed
  const responseData = {
    status: dbHealth.connected ? 'ok' : 'degraded',
    service: 'mobilix-public-catalog-api',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: {
      status: dbHealth.connected ? 'connected' : 'disconnected',
    },
  };

  const statusCode = dbHealth.connected ? 200 : 503;

  return NextResponse.json(responseData, {
    status: statusCode,
    headers: {
      'Cache-Control': CACHE_POLICIES.HEALTH,
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
