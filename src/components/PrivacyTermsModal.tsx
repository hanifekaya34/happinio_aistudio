import React from 'react';
import { X, ShieldCheck, Lock, FileText, Mail, MapPin } from 'lucide-react';

interface PrivacyTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyTermsModal({ isOpen, onClose }: PrivacyTermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full my-8 shadow-2xl border border-pink-100 overflow-hidden relative flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 border-b border-pink-100 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 rounded-full shadow-xs transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-pink-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Lock className="w-4 h-4 text-pink-500" />
            <span>Yasal Bilgilendirme & Güvenlik</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
            KVKK ve Gizlilik Sözleşmesi
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            6698 sayılı Kişisel Verilerin Korunması Kanunu Kapsamında Aydınlatma Metni
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 text-left overflow-y-auto font-normal text-slate-700 leading-relaxed text-xs sm:text-sm">
          {/* Section 1 */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2 font-serif text-pink-600">
              <FileText className="w-4 h-4" />
              <span>1. Kişisel Verileriniz Nelerdir?</span>
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Kişisel veriler; ad, soyad, doğum tarihi ve doğum yeri gibi bilgiler olabileceği gibi; telefon numarası, motorlu taşıt plakası, sosyal güvenlik numarası, pasaport numarası, özgeçmiş, resim, görüntü ve ses kayıtları, parmak izleri, e-posta adresi, hobiler, tercihler, etkileşimde bulunulan kişiler, grup üyelikleri, aile bilgileri, sağlık bilgileri gibi kişiyi doğrudan veya dolaylı olarak belirlenebilir kılan tüm verilerdir.
            </p>
          </div>

          {/* Section 2 */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2 font-serif text-pink-600">
              <ShieldCheck className="w-4 h-4" />
              <span>2. Kişisel Verileriniz Tarafımızca Neden ve Nasıl İşlenir?</span>
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Kişisel verileriniz; Happinio’dan ürün alabilmeniz, bu ürünlerin bedellerini ödeyebilmeniz ve ürünlerin sizlere ulaştırılması amacı ile talep edilmekte ve kaydedilmekte, bu da veri işleme işlemini oluşturmaktadır.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Yalnızca gerekli olan kişisel verileriniz kaydedilmek üzere sizlerden talep edilmektedir.
            </p>
            <p className="text-slate-600 leading-relaxed">
              6698 sayılı Kişisel Verilerin Korunması Kanunu’na uygun olarak kişisel verileriniz sistemimize kaydedilmekte olup hangi kişisel verilerinizin işlendiğini ve eğer istiyorsanız kişisel verilerinizin silinmesini yazılı olarak talep etme hakkınız her zaman bulunmaktadır.
            </p>
          </div>

          {/* Section 3 */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2 font-serif text-pink-600">
              <Lock className="w-4 h-4" />
              <span>3. Kişisel Verileriniz Kimlerle Paylaşılır?</span>
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Kişisel verileriniz Happinio’nun da bir parçası olduğu Doğa Derneği, Doğa Okulu ve bunun gibi doğa koruma çalışmaları yapan ulusal ve uluslararası kuruluşlarca, sizleri bu kuruluşların eylem, proje ve aktivitelerinden haberdar etmek amacı ile paylaşılacaktır. Reklam amacıyla hiçbir kurum veya kişiyle kişisel verilerinizin paylaşılması söz konusu olmamaktadır.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Kişisel Verileriniz ile ilgili ayrıntılı bilgi ve Happinio’dan bu bilgilere ilişkin talep haklarınız aşağıda aydınlatma metninde yer almaktadır.
            </p>
          </div>

          {/* Aydınlatma Formu Section */}
          <div className="border-t border-slate-200 pt-5 space-y-3">
            <h3 className="text-base sm:text-lg font-bold text-purple-900 font-serif">
              Kişisel Verilerin Korunması Kanunu Kapsamında Aydınlatma Formu
            </h3>
            
            <p className="text-slate-600 leading-relaxed">
              6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, gerçek bir kişinin kimliğini belirli ya da belirlenebilir bir hale getirmeye yarayan her türlü bilgi kişisel veri kapsamındadır. Happinio’ya vermiş olduğunuz özel nitelikli kişisel verileriniz de dâhil olmak üzere kişisel verileriniz, aşağıda açıklanan sebep, amaç ve yöntemlerle, ilgili yasal düzenlemeler ve yasal otoritelerce öngörülen bilgi saklama, raporlama, bilgilendirme yükümlülüklerine uyum gereği, Veri Sorumlusu sıfatıyla sistemlerimize kaydedilecek, depolanacak, muhafaza edilecek, saklanacak, yasal, işletmesel gerekler, nedenler ile sınıflandırılacak, güncellenecek ve mevzuatın izin verdiği durumlarda ve yasal sınırlar dâhilinde 3. kişilere açıklanabilecek/devredilebilecek, sınıflandırılabilecek ve KVKK’da sayılan şekillerde işlenebilecektir.
            </p>

            <p className="text-slate-600 leading-relaxed">
              Happinio’ya sunmuş olduğunuz kişisel verileriniz Türkiye’de yürürlükte bulunan mevzuat hükümlerinin izin verdiği ölçüde alışveriş işlemlerinin sorunsuz şekilde tamamlanması için işlenecek, Happinio’nun bir parçası olduğu doğa koruma çalışmaları yapan kurum ve kuruluşlarla sizleri bu kurum ve kuruluşlardan haberdar etmek amacı ile paylaşılabilecektir.
            </p>

            <p className="text-slate-600 leading-relaxed">
              Kişisel verinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme, kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme, kanunda öngörülen şartlar çerçevesinde kişisel verilerinizin silinmesini veya yok edilmesini isteme, kişisel verilerinizin aktarıldığı üçüncü kişilere bildirilmesini isteme, işlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme ve kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme haklarına sahip olduğunuzdan bu konulara ilişkin tarafımıza aşağıda yer alan iletişim adresleri aracılığı ile başvurmanız halinde talebiniz 30 gün içinde sonuçlandırılacaktır.
            </p>

            {/* Contact Box */}
            <div className="bg-pink-50/80 p-4 rounded-2xl border border-pink-200/80 space-y-2 mt-4">
              <h4 className="font-bold text-slate-800 text-xs sm:text-sm">
                Happinio Başvuru ve İletişim Adresleri:
              </h4>
              <div className="grid sm:grid-cols-2 gap-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-pink-600 shrink-0" />
                  <span><strong>Posta adresi:</strong> Eskişehir / Türkiye</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-pink-600 shrink-0" />
                  <span><strong>E-posta adresi:</strong> iletisim@happinio.com</span>
                </div>
              </div>
            </div>
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

