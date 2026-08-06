import React from 'react';
import { X, RotateCcw, Mail, FileText, CheckCircle2 } from 'lucide-react';

interface ReturnPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReturnPolicyModal({ isOpen, onClose }: ReturnPolicyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full my-8 shadow-2xl border border-pink-100 overflow-hidden relative flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 border-b border-pink-100 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 rounded-full shadow-xs transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-purple-700 font-bold text-xs uppercase tracking-wider mb-1">
            <RotateCcw className="w-4 h-4 text-purple-600" />
            <span>Kullanıcı Hakları & İade İşlemleri</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
            İade Süreci
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Happinio alışverişlerinizde ürün iade koşulları ve prosedürü
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-5 text-left overflow-y-auto font-normal text-slate-700 leading-relaxed text-xs sm:text-sm">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-slate-700 leading-relaxed">
                Happinio’dan yaptığınız alışverişlerde, satın aldığınız ürünleri, kabul ettiğiniz satış sözleşmesinin beşinci maddesi uyarınca geri iade edebilirsiniz.
              </p>
            </div>

            <div className="flex items-start gap-3 pt-2 border-t border-slate-200/80">
              <FileText className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <p className="text-slate-700 leading-relaxed">
                Kullanılmamış olmak kaydı ile ürün tesliminden itibaren yedi gün içerisinde bize haber verdiğiniz takdirde iade süreci başlar. Ürünü bize geri yolladığınıza dair kargo teslim tutanağı ve faturanın aslının elimize ulaşmasını takip eden on beş gün içerisinde sözleşme maddeleri uyarınca ürün bedeli tarafınıza iade edilir.
              </p>
            </div>
          </div>

          {/* Contact Box */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-2xl border border-purple-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white rounded-xl shadow-xs border border-purple-100 text-pink-600">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">Detaylı Bilgi ve İade Talebi İçin:</span>
                <span className="text-xs text-slate-600">Bizimle e-posta üzerinden iletişime geçebilirsiniz.</span>
              </div>
            </div>
            <a
              href="mailto:iletisim@happinio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
            >
              iletisim@happinio.com
            </a>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Anladım & Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
