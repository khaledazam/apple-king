import { ShieldCheck, MapPin, MessageSquare, Eye } from 'lucide-react';

const services = [
  { icon: Eye, title: 'شوف التفاصيل بوضوح', description: 'الحالة، الألوان والسعات في صفحة كل منتج. قارن براحتك قبل ما تختار.' },
  { icon: MapPin, title: 'اتأكد قبل الزيارة', description: 'اسأل فريقنا عن توافر جهازك في الفرع، واتفق على تفاصيل المعاينة والاستلام.' },
  { icon: ShieldCheck, title: 'اسأل عن الضمان', description: 'اعرف تفاصيل الضمان والفحص الخاصة بالجهاز اللي اخترته قبل الحجز.' },
  { icon: MessageSquare, title: 'مساعدة من شخص فاهم', description: 'محتار بين موديلين؟ احكيلنا عن استخدامك، ونساعدك تختار الأنسب.' },
];
export function ValueProposition() {
  return <section className="shop-section service-section" aria-labelledby="service-title"><div className="shop-heading"><div><p className="shop-eyebrow">تجربة ملك التفاحه</p><h2 id="service-title">التفاصيل هي اللي بتفرق.</h2><p className="shop-section-description">من أول سؤال، لحد ما تستلم جهازك.</p></div></div><div className="service-grid">{services.map(({ icon: Icon, title, description }) => <article key={title}><Icon size={31} strokeWidth={1.3} aria-hidden="true" /><h3>{title}</h3><p>{description}</p></article>)}</div></section>;
}
