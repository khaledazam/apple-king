import React from 'react';
import Link from 'next/link';
import { Logo } from '../ui/Logo';
import { MessageCircle, MapPin, Clock } from 'lucide-react';
import { sanitizeWhatsAppNumber } from '@/lib/whatsapp';

export function Footer() {
  const whatsappNumber = sanitizeWhatsAppNumber();
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('مرحبًا، أود الاستفسار عن تفاصيل فروع وأجهزة APPLE KING.')}`;

  return (
    <footer className="bg-[#161617] text-[#86868b] text-xs border-t border-white/[0.08] pt-12 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Apple Style Footnotes / Disclaimers */}
        <div className="space-y-2 border-b border-white/[0.06] pb-6 text-[11px] leading-relaxed text-[#86868b]">
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
            <p className="text-[12px] leading-relaxed text-[#86868b]">
              الوجهة المتخصصة في هواتف آبل وسامسونج الأصلية والإكسسوارات المعتمدة، مع تجربة استلام فورية وضمان معتمد.
            </p>
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-[#f5f5f7] text-xs font-normal transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#0071e3]" />
                <span>واتساب المبيعات</span>
              </a>
            </div>
          </div>

          {/* Col 2: Catalog Sections */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-[#f5f5f7] tracking-wider">
              استكشف الكتالوج
            </h4>
            <ul className="space-y-2 text-[12px]">
              <li>
                <Link href="/products?productType=phone" className="hover:text-[#f5f5f7] transition-colors">
                  هواتف iPhone وGalaxy
                </Link>
              </li>
              <li>
                <Link href="/products?productType=accessory" className="hover:text-[#f5f5f7] transition-colors">
                  إكسسوارات وشواحن MagSafe
                </Link>
              </li>
              <li>
                <Link href="/products?featured=true" className="hover:text-[#f5f5f7] transition-colors">
                  الموديلات والعروض المميزة
                </Link>
              </li>
              <li>
                <Link href="/products?availability=in_stock" className="hover:text-[#f5f5f7] transition-colors">
                  المتاح للتسليم الفوري
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Branches & Hours */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-[#f5f5f7] tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#0071e3]" />
              <span>المتاجر وساعات العمل</span>
            </h4>
            <ul className="space-y-2 text-[12px]">
              <li>فرع القاهرة: مدينة نصر / التجمع الخامس</li>
              <li>فرع الجيزة: شارع الهرم / المهندسين</li>
              <li className="flex items-center gap-1 text-[#86868b] pt-1">
                <Clock className="w-3.5 h-3.5 text-[#86868b]" />
                <span>يوميًا من ١١:٠٠ صباحًا حتى ١١:٠٠ مساءً</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Verification */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-[#f5f5f7] tracking-wider">
              المصداقية والضمان
            </h4>
            <p className="text-[12px] leading-relaxed text-[#86868b]">
              جميع الأجهزة الجديدة تأتي بالضمان الأصلي، والأجهزة المستعملة تخضع لفحص تفصيلي يشمل البطارية، الشاشة، وكافة المكونات الأساسية.
            </p>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#86868b]">
          <p>
            جميع الحقوق محفوظة &copy; {new Date().getFullYear()} Apple King Store.
          </p>
          <p>
            كتالوج رقمي للعرض والاستفسار • الحجز والتأكيد المباشر عبر واتساب المبيعات
          </p>
        </div>
      </div>
    </footer>
  );
}
