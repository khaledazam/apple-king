import Link from 'next/link';
import { ChevronLeft, Check, Plus, Smartphone, HardDrive, Headphones } from 'lucide-react';

const guides = [
  { icon: Smartphone, step: '01', title: 'ابدأ باستخدامك.', text: 'تصوير، شغل، ولا ألعاب؟ اختار الموديل على أساس الحاجات اللي بتعملها كل يوم.', link: 'اكتشف الهواتف', href: '/products?productType=phone' },
  { icon: HardDrive, step: '02', title: 'خد مساحة للي بتحبه.', text: 'صور وفيديوهات كتير؟ راجع السعات المتاحة في صفحة الجهاز، واختار مساحة تكفيك.', link: 'قارن الاختيارات', href: '/products?productType=phone' },
  { icon: Headphones, step: '03', title: 'كمّل الأساسيات.', text: 'اتأكد من توافق الشاحن والكابل والسماعة مع جهازك، وخلي كل حاجة جاهزة من أول يوم.', link: 'شوف الإكسسوارات', href: '/products?productType=accessory' },
];
const questions = [
  { question: 'إزاي أستفسر أو أحجز جهاز؟', answer: 'افتح صفحة المنتج، اختار اللون والسعة لو متاحين، واضغط على زر واتساب. فريقنا هيأكد معاك السعر والتوافر وتفاصيل الاستلام قبل تأكيد الحجز.' },
  { question: 'هل السعر والتوافر بيتغيروا؟', answer: 'الأسعار والكميات بتتحدث مع بيانات الكتالوج. يُفضّل تأكيد السعر وتوافر اللون والسعة مع المبيعات قبل زيارة الفرع.' },
  { question: 'إيه اللي أراجعه قبل شراء جهاز مستعمل؟', answer: 'راجع حالة الجهاز والسعة واللون، واسأل عن حالة البطارية والفحص والضمان. اطلب معاينة الجهاز وتأكد من كل التفاصيل مع الفريق قبل الشراء.' },
  { question: 'هل ممكن أستبدل جهازي الحالي؟', answer: 'تواصل مع الفريق واذكر موديل جهازك وحالته. قبول الاستبدال والقيمة النهائية بيتحددوا بعد الفحص الفني في الفرع.' },
];
export function ShoppingGuide() {
  return <><section className="shopping-guide" aria-labelledby="guide-title"><div className="shop-section"><div className="shop-heading"><div><p className="shop-eyebrow">A LITTLE GUIDANCE</p><h2 id="guide-title">اختيار أحسن.<span> بخطوات أبسط.</span></h2></div></div><div className="guide-grid">{guides.map(({ icon: Icon, step, title, text, link, href }) => <article key={step}><div className="guide-card-top"><Icon size={30} strokeWidth={1.25} aria-hidden="true" /><span>{step}</span></div><h3>{title}</h3><p>{text}</p><Link href={href} className="shop-text-link">{link}<ChevronLeft size={16} /></Link></article>)}</div></div></section><section className="shop-section faq-section" aria-labelledby="faq-title"><div><p className="shop-eyebrow">GOOD TO KNOW</p><h2 id="faq-title">قبل ما تختار.</h2><p>إجابات على أسئلة ممكن تكون في بالك.</p><span className="faq-note"><Check size={17} />تفاصيل أوضح. قرار أسهل.</span></div><div className="faq-list">{questions.map(({ question, answer }) => <details key={question}><summary>{question}<Plus size={19} aria-hidden="true" /></summary><p>{answer}</p></details>)}</div></section></>;
}
