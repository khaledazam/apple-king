'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Download, X, Share2, PlusSquare, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('[PWA] Service Worker registered with scope:', reg.scope);
          })
          .catch((err) => {
            console.warn('[PWA] Service Worker registration failed:', err);
          });
      });
    }

    // 2. Check if already installed / running in standalone mode
    const isRunningStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isRunningStandalone) {
      setIsStandalone(true);
      return;
    }

    // 3. Check dismissed flag in localStorage
    const dismissedAt = localStorage.getItem('apple_king_pwa_dismissed');
    if (dismissedAt) {
      const daysSinceDismissed = (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 5) {
        return; // Don't show if dismissed within 5 days
      }
    }

    // 4. Android / Desktop Chrome beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // 5. iOS Safari Detection
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/chrome|crios|fxios/.test(userAgent);

    if (isIosDevice && isSafari && !isRunningStandalone) {
      setIsIos(true);
      // Show iOS prompt after 3 seconds of browsing
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosGuide(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('[PWA] User choice outcome:', outcome);
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIosGuide(false);
    localStorage.setItem('apple_king_pwa_dismissed', Date.now().toString());
  };

  // Don't render if already in standalone app mode or not ready
  if (isStandalone || !showPrompt) return null;

  return (
    <>
      {/* Floating Bottom PWA Install Banner */}
      <div
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 print:hidden"
        dir="rtl"
      >
        <div className="bg-[#0b1328]/95 backdrop-blur-md border border-amber-400/40 rounded-2xl p-3.5 shadow-2xl text-slate-100 flex items-center justify-between gap-3">
          
          {/* App Icon */}
          <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-amber-400/50 bg-[#060b18] shadow-md flex items-center justify-center">
            <Image
              src="/icons/icon-192.png"
              alt="ملك التفاحه"
              width={44}
              height={44}
              className="object-cover"
            />
          </div>

          {/* App Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-white truncate">تطبيق ملك التفاحه</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                PWA
              </span>
            </div>
            <p className="text-[11px] text-slate-300 truncate mt-0.5">
              {isIos ? 'ثبّت التطبيق على شاشة الآيفون' : 'تثبيت سريع للوصول المباشر بدون متصفح'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>تثبيت</span>
            </button>

            <button
              onClick={handleDismiss}
              aria-label="إغلاق"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* iOS Step-by-Step Installation Modal Guide */}
      {showIosGuide && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-4 print:hidden"
          dir="rtl"
        >
          <div className="bg-[#0b1328] border-2 border-amber-400/50 rounded-3xl p-6 max-w-sm w-full text-slate-100 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white">تثبيت التطبيق على أجهزة الآيفون</h3>
              </div>
              <button onClick={() => setShowIosGuide(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              لتثبيت متجر وبوابة تقسيط ملك التفاحه كـ تطبيق أصلي على شاشة هاتفك الرئيسية، اتبع الخطوتين:
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  اضغط على زر المشاركة أسفل شاشة المتصفح:
                  <div className="inline-flex items-center gap-1 font-bold text-amber-300 mr-1">
                    <Share2 className="w-3.5 h-3.5 inline" /> مشاركة (Share)
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  مرر القائمة واختر:
                  <div className="inline-flex items-center gap-1 font-bold text-emerald-300 mr-1">
                    <PlusSquare className="w-3.5 h-3.5 inline" /> إضافة إلى الصفحة الرئيسية (Add to Home Screen)
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors text-center"
            >
              فهمت، شكراً
            </button>

          </div>
        </div>
      )}
    </>
  );
}
