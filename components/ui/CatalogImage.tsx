import Image, { type ImageProps } from 'next/image';

function isInventoryPhoto(src: ImageProps['src']): boolean {
  if (typeof src !== 'string') return false;
  if (/^\/api\/catalog\/media\/[a-f0-9]{24}$/.test(src)) return true;
  const origin = process.env.NEXT_PUBLIC_ERP_MEDIA_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '');
  if (!origin) return false;
  try {
    const url = new URL(src);
    return url.origin === new URL(origin).origin && url.pathname.startsWith('/uploads/inventory/');
  } catch {
    return false;
  }
}

export default function CatalogImage(props: ImageProps) {
  return <Image {...props} unoptimized={props.unoptimized || isInventoryPhoto(props.src)} />;
}
