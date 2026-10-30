import Link from 'next/link';
import { ArrowLeftRight, ChevronLeft, MessageCircle, Smartphone } from 'lucide-react';
import { sanitizeWhatsAppNumber } from '@/lib/whatsapp';

export function PromoBanner() {
  const inquiry = `https://wa.me/${sanitizeWhatsAppNumber()}?text=${encodeURIComponent('أهلًا، عايز أستفسر عن استبدال هاتفي وتقييم حالته في ملك التفاحه.')}`;
  return <section className="shop-section trade-section" aria-labelledby="trade-title"><div className="trade-panel"><div className="trade-copy"><p className="shop-eyebrow">ملك التفاحه · الاستبدال</p><h2 id="trade-title">وقت التغيير؟<br /><span>ابدأ باللي معاك.</span></h2><p>اسألنا عن استبدال جهازك، واعرف قيمته بعد الفحص.<br />ونساعدك تختار الخطوة الجاية.</p><a href={inquiry} target="_blank" rel="noopener noreferrer" className="shop-button-gold"><MessageCircle size={18} />اسأل عن الاستبدال</a><small>قيمة الاستبدال وإمكانية قبوله بتتحدد بعد فحص الجهاز في الفرع.</small></div><div className="trade-visual" aria-hidden="true"><div className="trade-phone trade-phone-old"><Smartphone strokeWidth={.75} /></div><span className="trade-arrow"><ArrowLeftRight strokeWidth={1.4} /></span><div className="trade-phone trade-phone-new"><Smartphone strokeWidth={.75} /></div></div></div><Link href="/products?condition=used" className="used-device-strip"><div><span>اختيار ذكي، بقيمة مختلفة.</span><p>استكشف الأجهزة المستعملة، وراجع الحالة والسعة والتوافر قبل ما تقرر.</p></div><strong>تصفح المستعمل <ChevronLeft size={17} /></strong></Link></section>;
}
