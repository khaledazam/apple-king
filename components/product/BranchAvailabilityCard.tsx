import React from 'react';
import { MapPin, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { PublicBranchAllocation } from '@/types/catalog';
import { evaluateFreshness } from '@/lib/catalog/cache';

interface BranchAvailabilityCardProps {
  branchAvailability: PublicBranchAllocation[];
  lastInventorySync?: string;
}

export function BranchAvailabilityCard({
  branchAvailability,
  lastInventorySync,
}: BranchAvailabilityCardProps) {
  const freshness = evaluateFreshness(lastInventorySync);

  return (
    <div className="p-6 rounded-[24px] bg-white border border-black/[0.08] space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
        <h4 className="text-sm font-semibold text-[#1d1d1f] flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#0071e3]" />
          <span>الاستلام المباشر من المتاجر</span>
        </h4>
        <span className="text-[11px] text-[#6e6e73]">فحص وتجربة فورية</span>
      </div>

      {/* Branches List */}
      <div className="space-y-2.5">
        {branchAvailability && branchAvailability.length > 0 ? (
          branchAvailability.map((branch) => {
            const isAvailable = branch.inStockCount > 0;
            return (
              <div
                key={branch.branchId}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#f5f5f7] border border-black/[0.05] text-xs transition-colors hover:border-black/[0.12]"
              >
                <div className="space-y-0.5">
                  <span className="font-medium text-[#1d1d1f] block">
                    {branch.branchNameAr || branch.branchName}
                  </span>
                  <span className="text-[11px] text-[#6e6e73]">استلام فوري متاح اليوم</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {isAvailable ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      متوفر في المتجر
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/[0.04] text-[#6e6e73] border border-black/[0.06] text-[11px]">
                      <XCircle className="w-3.5 h-3.5" />
                      غير متوفر
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-4 text-center text-xs text-[#6e6e73] rounded-2xl bg-[#f5f5f7] border border-black/[0.05]">
            تواصل مع خدمة المبيعات لتحديد أقرب فرع متوفر به الموديل المطلوب.
          </div>
        )}
      </div>

      {/* Freshness / Stale Warning Notice */}
      {freshness.isStale && (
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
          <p className="leading-relaxed">
            {freshness.freshnessNoteAr || 'يُرجى تأكيد توفر الكميات والألوان عبر الواتساب قبل التوجه للفرع.'}
          </p>
        </div>
      )}
    </div>
  );
}
