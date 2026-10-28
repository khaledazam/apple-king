import React from 'react';
import { MapPin, CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';
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
    <div className="p-6 rounded-3xl bg-[#0F0F0F] border border-neutral-800/90 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#D6AC63]" />
          <span>توافر الجهاز في فروعنا</span>
        </h4>
        <span className="text-[11px] font-mono text-neutral-400">تسليم ومعاينة فورية</span>
      </div>

      {/* Branches List */}
      <div className="space-y-2.5">
        {branchAvailability && branchAvailability.length > 0 ? (
          branchAvailability.map((branch) => {
            const isAvailable = branch.inStockCount > 0;
            return (
              <div
                key={branch.branchId}
                className="flex items-center justify-between p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800/60 text-xs"
              >
                <div className="space-y-0.5">
                  <span className="font-bold text-neutral-200 block">
                    {branch.branchNameAr || branch.branchName}
                  </span>
                  <span className="text-[11px] text-neutral-500">معاينة مباشرة في المتجر</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {isAvailable ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-900/40 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      متوفر في الفرع
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-950 text-neutral-500 border border-neutral-800">
                      <XCircle className="w-3.5 h-3.5" />
                      غير متوفر
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-4 text-center text-xs text-neutral-400 rounded-2xl bg-neutral-900/40 border border-neutral-800">
            تواصل مع خدمة العملاء لتحديد أقرب فرع يتوفر به الجهاز.
          </div>
        )}
      </div>

      {/* Freshness / Stale Warning Notice */}
      {freshness.isStale && (
        <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-900/40 flex items-start gap-2.5 text-xs text-amber-300">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
          <p className="leading-relaxed">
            {freshness.freshnessNoteAr || 'يُرجى تأكيد توفر الكميات والألوان عبر الواتساب قبل التوجه للفرع.'}
          </p>
        </div>
      )}
    </div>
  );
}
