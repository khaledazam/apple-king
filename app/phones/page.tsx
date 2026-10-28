import { redirect } from 'next/navigation';

export default function PhonesRedirectPage() {
  redirect('/products?productType=phone');
}
