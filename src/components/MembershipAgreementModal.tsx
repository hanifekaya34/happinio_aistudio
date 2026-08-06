import React from 'react';
import { X, FileText, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface MembershipAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

export default function MembershipAgreementModal({ isOpen, onClose, onAccept }: MembershipAgreementModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full my-8 shadow-2xl border border-purple-100 overflow-hidden relative flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 border-b border-purple-100 relative">
          <button
            onClick={onClose}
            type="button"
            className="absolute top-5 right-5 p-2 bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 rounded-full shadow-xs transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-purple-700 font-bold text-xs uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4 text-purple-600" />
            <span>Happinio Kullanıcı Hakları & Yasal Koşullar</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
            Happinio Üyelik Sözleşmesi
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            www.happinio.com Platformu Kullanım ve Üyelik Şartları
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-5 text-left overflow-y-auto font-normal text-slate-700 leading-relaxed text-xs sm:text-sm">
          {/* Madde 1 */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base font-serif text-purple-800">
              1. TARAFLAR VE AMAC
            </h3>
            <p className="text-slate-600 leading-relaxed">
              İşbu Üyelik Sözleşmesi, Happinio E-Ticaret ve Hediye Atölyesi ("Happinio") ile www.happinio.com platformuna üye olan kullanıcı ("Üye") arasında, platform tarafından sunulan kişiselleştirilmiş hediye kutusu oluşturma, yapay zeka öneri sistemleri, alışveriş ve topluluk hizmetlerinden faydalanma şartlarını belirlemek amacıyla akdedilmiştir.
            </p>
          </div>

          {/* Madde 2 */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base font-serif text-purple-800">
              2. ÜYELİK ŞARTLARI VE HESAP GÜVENLİĞİ
            </h3>
            <p className="text-slate-600 leading-relaxed">
              2.1. Üye, üyelik formunda sunduğu ad, e-posta adresi ve iletişim bilgilerinin doğru ve eksiksiz olduğunu beyan eder.
            </p>
            <p className="text-slate-600 leading-relaxed">
              2.2. Üye, şifre ve hesap güvenliğinden bizzat sorumludur. Hesabın üçüncü kişilerce izinsiz kullanılması durumunda Happinio derhal bilgilendirilmelidir.
            </p>
            <p className="text-slate-600 leading-relaxed">
              2.3. Happinio, üyelik aşamasında sunulan +100 Hoş Geldin Sadakat Puanı ve kampanya haklarını usulsüz kullanım tespit ettiği hallerde iptal etme hakkını saklı tutar.
            </p>
          </div>

          {/* Madde 3 */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base font-serif text-purple-800">
              3. FİKRİ MÜLKİYET VE HİZMET KULLANIMI
            </h3>
            <p className="text-slate-600 leading-relaxed">
              3.1. Happinio platformunda yer alan Joy-Genie maskot görselleri, tasarımlar, metinler, marka logosu ve yazılım kodları Happinio’nun telif hakkı koruması altındadır.
            </p>
            <p className="text-slate-600 leading-relaxed">
              3.2. Üye, platformu yalnızca yasal amaçlarla ve hediye kutusu konsepti tasarlama/satın alma amacıyla kullanacağını taahhüt eder.
            </p>
          </div>

          {/* Madde 4 */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base font-serif text-purple-800">
              4. GİZLİLİK VE KİŞİSEL VERİLERİN KORUNMASI
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Happinio, Üye’ye ait kişisel verileri 6698 sayılı KVKK mevzuatına uygun olarak işler. Ayrıntılı bilgilendirme KVKK Aydınlatma Metni içerisinde yer almaktadır.
            </p>
          </div>

          {/* Madde 5 */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base font-serif text-purple-800">
              5. SÖZLEŞMENİN FESHİ VE İPTAL
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Üye dilediği zaman üyelikten ayrılma hakkına sahiptir. Happinio, kullanım şartlarının ihlali durumunda üyeliği askıya alma veya sonlandırma hakkını saklı tutar.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Okuduğunuz için teşekkür ederiz 🌸
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {onAccept && (
              <button
                type="button"
                onClick={() => {
                  onAccept();
                  onClose();
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Okudum, Kabul Ediyorum</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
