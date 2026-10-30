import React from 'react';
import Link from 'next/link';
import { Logo } from '../ui/Logo';
import { MessageCircle, MapPin, Clock } from 'lucide-react';
import { sanitizeWhatsAppNumber } from '@/lib/whatsapp';

export function Footer() {
  const whatsappNumber = sanitizeWhatsAppNumber('201097976407');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('مرحبًا، أود الاستفسار عن تفاصيل فروع وأجهزة ملك التفاحه.')}`;

  return (
    <footer className="king-footer bg-white text-[#6e6e73] text-xs border-t border-black/[0.08] pt-12 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Apple Style Footnotes / Disclaimers */}
        <div className="space-y-2 border-b border-black/[0.06] pb-6 text-[11px] leading-relaxed text-[#6e6e73]">
          <p>
            ١. الأسعار المعروضة في الكتالوج بالجنيه المصري (EGP) ومحدثة بصورة دورية وفق قوائم الأسعار المعتمدة للبيع كاش.
          </p>
          <p>
            ٢. التوافر في الفروع يخضع لحركة المبيعات اللحظية بالمخازن؛ يُرجى تأكيد توافر اللون والسعة عبر واتساب المبيعات قبل التوجه للمتجر.
          </p>
          <p>
            ٣. خيارات الاستبدال (Trade In) وتحديد القيمة التقديرية تخضع للفحص الفني الدقيق لحالة الجهاز في المتجر.
          </p>
        </div>

        {/* Directory Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Identity & Quick Inquiry */}
          <div className="space-y-3">
            <Logo showTagline={false} />
            <p className="text-[12px] leading-relaxed text-[#6e6e73]">
              الوجهة المتخصصة في هواتف آبل وسامسونج الأصلية والإكسسوارات المعتمدة، مع تجربة استلام فورية وضمان معتمد.
            </p>
            <div className="footer-contact">
              <span className="footer-contact-name">احمد عبدالعزيز</span>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="footer-contact-number" aria-label="تواصل مع احمد عبدالعزيز على واتساب 01097976407"><MessageCircle size={17} aria-hidden="true" /><span dir="ltr">01097976407</span></a>
            </div>
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/[0.03] hover:bg-black/[0.06] border border-black/[0.08] text-[#1d1d1f] text-xs font-normal transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#0071e3]" />
                <span>واتساب المبيعات</span>
              </a>
            </div>
          </div>

          {/* Col 2: Catalog Sections */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-[#1d1d1f] tracking-wider">
              استكشف الكتالوج
            </h4>
            <ul className="space-y-2 text-[12px]">
              <li>
                <Link href="/products?productType=phone" className="hover:text-[#1d1d1f] transition-colors">
                  هواتف iPhone وGalaxy
                </Link>
              </li>
              <li>
                <Link href="/products?productType=accessory" className="hover:text-[#1d1d1f] transition-colors">
                  إكسسوارات وشواحن MagSafe
                </Link>
              </li>
              <li>
                <Link href="/products?featured=true" className="hover:text-[#1d1d1f] transition-colors">
                  الموديلات والعروض المميزة
                </Link>
              </li>
              <li>
                <Link href="/products?availability=in_stock" className="hover:text-[#1d1d1f] transition-colors">
                  المتاح للتسليم الفوري
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Branches & Hours */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-[#1d1d1f] tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#0071e3]" />
              <span>المتاجر وساعات العمل</span>
            </h4>
            <ul className="space-y-2 text-[12px]">
              <li>فرع القاهرة: مدينة نصر / التجمع الخامس</li>
              <li>فرع الجيزة: شارع الهرم / المهندسين</li>
              <li className="flex items-center gap-1 text-[#6e6e73] pt-1">
                <Clock className="w-3.5 h-3.5 text-[#6e6e73]" />
                <span>يوميًا من ١١:٠٠ صباحًا حتى ١١:٠٠ مساءً</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Verification */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-[#1d1d1f] tracking-wider">
              المصداقية والضمان
            </h4>
            <p className="text-[12px] leading-relaxed text-[#6e6e73]">
              جميع الأجهزة الجديدة تأتي بالضمان الأصلي، والأجهزة المستعملة تخضع لفحص تفصيلي يشمل البطارية، الشاشة، وكافة المكونات الأساسية.
            </p>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-6 border-t border-black/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#6e6e73]">
          <p>
            جميع الحقوق محفوظة &copy; {new Date().getFullYear()} ملك التفاحه.
          </p>
          <p>
            كتالوج رقمي للعرض والاستفسار • الحجز والتأكيد المباشر عبر واتساب المبيعات
          </p>
        </div>
      </div>
    </footer>
  );
}
