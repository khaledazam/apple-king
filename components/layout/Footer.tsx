import React from 'react';
import Link from 'next/link';
import { Logo } from '../ui/Logo';
import { MessageCircle, MapPin, ShieldCheck, Clock, Sparkles } from 'lucide-react';
import { sanitizeWhatsAppNumber } from '@/lib/whatsapp';

export function Footer() {
  const whatsappNumber = sanitizeWhatsAppNumber();
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('مرحبًا، أود الاستفسار عن تفاصيل فروع وأجهزة APPLE KING.')}`;

  return (
    <footer className="bg-[#0A0A0A] border-t border-neutral-800/80 pt-16 pb-12 text-neutral-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand & Identity */}
          <div className="space-y-4">
            <Logo showTagline={false} />
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              وجهتكم الأولى للهواتف الذكية والإكسسوارات الأصلية. نوفر أحدث إصدارات آبل وسامسونج مع ضمان معتمد وخدمة عملاء مباشرة عبر فروعنا والواتساب.
            </p>
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-900 border border-[#D6AC63]/40 text-[#F1D49A] hover:bg-[#D6AC63]/10 text-xs font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>محادثة فورية مع المبيعات</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D6AC63]" />
              أقسام الكتالوج
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/products?productType=phone" className="hover:text-[#F1D49A] transition-colors">
                  هواتف آيفون وسامسونج
                </Link>
              </li>
              <li>
                <Link href="/products?productType=accessory" className="hover:text-[#F1D49A] transition-colors">
                  إكسسوارات وشواحن وسماعات
                </Link>
              </li>
              <li>
                <Link href="/products?featured=true" className="hover:text-[#F1D49A] transition-colors">
                  العروض والمنتجات المميزة
                </Link>
              </li>
              <li>
                <Link href="/products?availability=in_stock" className="hover:text-[#F1D49A] transition-colors">
                  المتاح للتسليم الفوري
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Multi-Branch & Store Hours */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#D6AC63]" />
              فروعنا وساعات العمل
            </h3>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li className="flex items-start gap-2">
                <span className="text-[#D6AC63] font-bold">•</span>
                <span>فرع القاهرة الرئيسي: مدينة نصر / التجمع</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D6AC63] font-bold">•</span>
                <span>فرع الجيزة: شارع الهرم / المهندسين</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-neutral-500 mt-0.5" />
                <span>يوميًا من 11:00 صباحًا حتى 11:00 مساءً</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Quality & Trust */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              ضمان ومصداقية
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              جميع الأجهزة والإكسسوارات معروضة بالأسعار المعتمدة للبيع كاش من خلال الكتالوج الرسمي. يتم تأكيد التوافر والحجز المباشر عبر خدمة العملاء بالفروع.
            </p>
            <div className="text-[11px] text-neutral-500 p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
              الأسعار بالجنيه المصري (EGP) ومحدثة بصورة دورية.
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Storefront Disclaimer */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>
            جميع الحقوق محفوظة &copy; {new Date().getFullYear()} — متجر <strong className="text-neutral-300">APPLE KING</strong>.
          </p>
          <p className="text-neutral-500 text-[11px]">
            كتالوج إلكتروني للعرض والاستفسار • الطلب المباشر عبر الواتساب والمبيعات
          </p>
        </div>
      </div>
    </footer>
  );
}
