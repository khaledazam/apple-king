import { GridFSBucket, ObjectId } from 'mongodb';
import { getStorefrontCollection, getStorefrontDb } from '@/lib/db/mongodb';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const notFound = () => new Response('Image not found', { status: 404, headers: { 'Cache-Control': 'no-store' } });

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-f0-9]{24}$/.test(id)) return notFound();
  try {
    const url = `/api/catalog/media/${id}`;
    const collection = await getStorefrontCollection<any>();
    const published = await collection.findOne({ isPublished: true, $or: [{ images: url }, { coverImage: url }, { 'media.url': url }, { 'media.secureUrl': url }] }, { projection: { _id: 1 } });
    if (!published) return notFound();
    const bucket = new GridFSBucket(await getStorefrontDb(), { bucketName: 'catalogimages' });
    const objectId = new ObjectId(id);
    const file = await bucket.find({ _id: objectId, 'metadata.kind': 'catalog-image' }).next();
    if (!file || file.length > 5 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(file.metadata?.contentType)) return notFound();
    const chunks: Buffer[] = [];
    for await (const chunk of bucket.openDownloadStream(objectId)) chunks.push(Buffer.from(chunk));
    const bytes = Buffer.concat(chunks);
    return new Response(new Uint8Array(bytes), { headers: { 'Content-Type': file.metadata!.contentType, 'Content-Length': String(bytes.length), 'Cache-Control': 'public, max-age=3600', 'X-Content-Type-Options': 'nosniff' } });
  } catch {
    return new Response('Unable to load image', { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
