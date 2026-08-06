import React, { useState, useEffect } from 'react';
import HapyMascot from './HapyMascot';
import { Sparkles, CheckCircle2, Gift } from 'lucide-react';

interface AILoadingModalProps {
  isOpen: boolean;
}

export default function AILoadingModal({ isOpen }: AILoadingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Joy-Genie promptunu inceliyor ve duygu analizini yapıyor...',
    'Veritabanındaki stoklu ve tematik ürünler taranıyor...',
    'Bütçe ve ilgi alanlarına göre optimum kombinasyon seçiliyor...',
    'Kişiye özel duygu dolu hediye notu kartı yazılıyor...',
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 900);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-[#FAF7F2] rounded-[36px] p-6 sm:p-8 max-w-lg w-full text-center shadow-2xl border border-purple-200 relative my-auto space-y-4">
        
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-56 h-56 bg-purple-200/50 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

        {/* Mascot with dancing animation & floating gift boxes */}
        <div className="pt-2 flex flex-col items-center justify-center relative">
          {/* Scattered star emojis / Sparkles */}
          <div className="absolute -top-4 left-6 text-amber-400 text-xl animate-[pulse_1.5s_infinite_100ms] pointer-events-none">✨</div>
          <div className="absolute -top-2 right-8 text-yellow-400 text-2xl animate-[pulse_2s_infinite_300ms] pointer-events-none">⭐</div>
          <div className="absolute top-12 -left-4 text-purple-400 text-lg animate-[pulse_1.8s_infinite_500ms] pointer-events-none">✨</div>
          <div className="absolute top-10 -right-6 text-amber-300 text-xl animate-[pulse_1.6s_infinite_200ms] pointer-events-none">⭐</div>
          <div className="absolute bottom-6 -left-2 text-yellow-300 text-xl animate-[pulse_2.2s_infinite_400ms] pointer-events-none">⭐</div>
          <div className="absolute bottom-4 -right-2 text-pink-400 text-lg animate-[pulse_1.7s_infinite_600ms] pointer-events-none">✨</div>
          <div className="absolute -bottom-2 left-12 text-purple-300 text-sm animate-pulse pointer-events-none">✨</div>
          <div className="absolute -bottom-4 right-16 text-yellow-400 text-lg animate-pulse pointer-events-none">⭐</div>

          <div className="absolute bottom-2 left-16 text-pink-500 animate-pulse">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="absolute bottom-2 right-16 text-purple-500 animate-pulse">
            <Sparkles className="w-5 h-5" />
          </div>

          {/* Non-bouncing Mascot Wrapper */}
          <div className="hover:scale-105 transition-transform">
            <HapyMascot size="lg" level="Süper Happinio" speechBubble="Joy-Genie en doğru parçaları bir araya getiriyor... ✨" />
          </div>
        </div>

        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif mb-1">
            Sihirli Hediye Kutun Hazırlanıyor ✨
          </h3>

          <p className="text-xs sm:text-sm text-slate-600">
            Doğal dil işleme modeli ile kişiye özel hediye kutu sepetin oluşturuluyor.
          </p>
        </div>

        {/* Step Progress */}
        <div className="space-y-3 text-left bg-white p-4 sm:p-5 rounded-2xl border border-purple-200/80 shadow-xs">
          {steps.map((stepText, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div key={idx} className="flex items-start gap-3 text-xs transition-all">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : isCurrent ? (
                  <div className="w-4 h-4 rounded-full border-2 border-purple-700 border-t-transparent animate-spin shrink-0 mt-0.5" />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-slate-200 shrink-0 mt-0.5" />
                )}
                <span className={`font-medium leading-relaxed ${isCurrent ? 'text-purple-900 font-bold' : isDone ? 'text-slate-600 line-through opacity-70' : 'text-slate-400'}`}>
                  {stepText}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="w-full bg-purple-100 h-2.5 rounded-full overflow-hidden border border-purple-200">
          <div
            className="bg-gradient-to-r from-purple-700 via-amber-500 to-purple-900 h-full transition-all duration-500 rounded-full"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
