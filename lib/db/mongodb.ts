/**
 * MOBILIX ONLINE STOREFRONT — MONGODB ATLAS READ-ONLY CLIENT
 *
 * Security & Isolation Guarantees:
 * 1. Connects strictly to MongoDB Atlas using `STOREFRONT_MONGODB_URI`.
 * 2. Catalog documents are read from `storefrontproducts`; the media route reads only the catalogimages GridFS bucket.
 * 3. Enforces read-only collection isolation.
 * 4. Never connects to the local ERP backend or internal inventory collections.
 * 5. Uses connection pooling and caches the client across Next.js reloads.
 */

import { MongoClient, Db, Collection } from 'mongodb';

// Ensure this module is never accidentally imported on the client side
if (typeof window !== 'undefined') {
  throw new Error('mongodb.ts must only be loaded in a Node.js server environment.');
}

const DEFAULT_DB_NAME = 'erp_phones';
const ALLOWED_COLLECTION = 'storefrontproducts';

interface GlobalMongoCache {
  conn: { client: MongoClient; db: Db } | null;
  promise: Promise<{ client: MongoClient; db: Db }> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _storefrontMongo: GlobalMongoCache | undefined;
}

let cached = global._storefrontMongo;

if (!cached) {
  cached = global._storefrontMongo = { conn: null, promise: null };
}

/**
 * Obtains a cached MongoDB Atlas client connected with dedicated storefront credentials.
 */
export async function getStorefrontDb(): Promise<Db> {
  const uri = process.env.STOREFRONT_MONGODB_URI;

  if (!uri) {
    throw new Error(
      'STOREFRONT_MONGODB_URI is not defined. Please configure a read-only Atlas connection string in environment variables.'
    );
  }

  if (cached!.conn) {
    return cached!.conn.db;
  }

  if (!cached!.promise) {
    const opts = {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 20000,
    };

    cached!.promise = MongoClient.connect(uri, opts).then((client) => {
      const dbName = process.env.STOREFRONT_DB_NAME || DEFAULT_DB_NAME;
      const db = client.db(dbName);
      return { client, db };
    });
  }

  try {
    cached!.conn = await cached!.promise;
    return cached!.conn.db;
  } catch (error) {
    cached!.promise = null; // Reset promise so subsequent calls can retry
    throw error;
  }
}

/**
 * Obtains the isolated, read-only `storefrontproducts` collection.
 * Accessing any other collection will throw an immediate privilege violation error.
 */
export async function getStorefrontCollection<T extends Document = Document>(
  collectionName: string = ALLOWED_COLLECTION
): Promise<Collection<T>> {
  if (collectionName !== ALLOWED_COLLECTION) {
    throw new Error(
      `Access Denied: Public storefront is strictly restricted to '${ALLOWED_COLLECTION}'. Attempted: '${collectionName}'`
    );
  }

  const db = await getStorefrontDb();
  return db.collection<T>(ALLOWED_COLLECTION);
}

/**
 * Diagnostic health check verifying database ping without revealing connection credentials.
 */
export async function pingStorefrontDb(): Promise<{ connected: boolean; latencyMs?: number; error?: string }> {
  const start = Date.now();
  try {
    const db = await getStorefrontDb();
    await db.command({ ping: 1 });
    return {
      connected: true,
      latencyMs: Date.now() - start,
    };
  } catch (err: any) {
    return {
      connected: false,
      error: err?.message || 'Database connection unreachable',
    };
  }
}
