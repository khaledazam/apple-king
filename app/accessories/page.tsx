import { redirect } from 'next/navigation';

export default function AccessoriesRedirectPage() {
  redirect('/products?productType=accessory');
}
