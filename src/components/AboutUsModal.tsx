import React from 'react';
import { X, Heart, Sparkles, Award } from 'lucide-react';
import HapyMascot from './HapyMascot';

interface AboutUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutUsModal({ isOpen, onClose }: AboutUsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-[36px] max-w-2xl w-full my-8 shadow-2xl border border-pink-100 overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 bg-pink-50 hover:bg-pink-100 text-slate-600 rounded-full transition-all">
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6 text-left">
          <div className="flex items-center gap-4 border-b border-pink-100 pb-4">
            <HapyMascot size="md" level="Süper Happinio" />
            <div>
              <span className="text-xs font-bold text-pink-600 uppercase tracking-widest">Hikâyemiz</span>
              <h2 className="text-2xl font-bold text-slate-800 font-serif">Happinio - Sevgi Dolu Hediye Dünyası</h2>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-600 leading-relaxed font-normal">
            <p>
              Happinio, e-ticaret dünyasındaki soğuk ve sıradan hediyelerin aksine; sevdiklerinize kendilerini özel hissettirecek samimi sürpriz kutuları hazırlamak amacıyla kuruldu.
            </p>
            <p>
              Akıllı Joy-Genie hediye asistanımız sayesinde saatlerce hediye aramadan, sevdiklerinizin ilgi alanlarına en uygun kutuyu oluşturabilir ya da yerel zanaatkâr kadın üreticilerimizin el emeği ürünlerinden hazırlanan hazır tematik koleksiyonlarımızı seçebilirsiniz.
            </p>

            <h3 className="text-sm font-bold text-slate-800 font-serif pt-2">Temel İlkelerimiz:</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li><strong>Samimiyet & El Emeği:</strong> Her kutuu özenle tek tek ürünleri derlenerek paketlenir ve gönderilir.</li>
              <li><strong>Yerel Zanaatkârlar:</strong> Türkiye'nin farklı şehirlerinden özgün el yapımı mumlar, seramikler ve lezzetler.</li>
              <li><strong>Sürdürülebilirlik:</strong> Geri dönüştürülebilir kutular ve biyolojik pamuk kurdeleler.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
