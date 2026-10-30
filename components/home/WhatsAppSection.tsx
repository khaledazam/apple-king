import { MessageCircle, ArrowUpLeft } from 'lucide-react';
import { sanitizeWhatsAppNumber } from '@/lib/whatsapp';

export function WhatsAppSection() {
  const url = `https://wa.me/${sanitizeWhatsAppNumber()}?text=${encodeURIComponent('أهلًا ملك التفاحه، محتاج مساعدة في اختيار جهاز مناسب لاستخدامي وميزانيتي.')}`;
  return <section className="specialist-section" aria-labelledby="specialist-title"><div className="shop-container specialist-inner"><div className="specialist-symbol" aria-hidden="true"><MessageCircle size={49} strokeWidth={1} /><span /></div><div><p className="shop-eyebrow">LET’S FIND YOUR NEXT</p><h2 id="specialist-title">لسه محتار؟ نتكلم.</h2><p>قولّنا بتدور على إيه وميزانيتك كام.<br />ونرتب الاختيارات معاك، واحدة واحدة.</p></div><a href={url} target="_blank" rel="noopener noreferrer" className="shop-button-gold">اتكلم مع فريق ملك التفاحه <ArrowUpLeft size={20} /></a></div></section>;
}
