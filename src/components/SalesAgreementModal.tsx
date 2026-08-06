import React from 'react';
import { X, FileText, ShoppingBag, ShieldCheck, MapPin, Mail, Phone } from 'lucide-react';

interface SalesAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SalesAgreementModal({ isOpen, onClose }: SalesAgreementModalProps) {
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
            <FileText className="w-4 h-4 text-pink-500" />
            <span>Yasal Mevzuat & Sözleşmeler</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
            Mesafeli Satış Sözleşmesi
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            6502 Sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği Uyarınca
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 text-left overflow-y-auto font-normal text-slate-700 leading-relaxed text-xs sm:text-sm">
          {/* MADDE 1 */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base font-serif text-pink-600">
              MADDE 1 - TARAFLAR
            </h3>
            
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 text-xs sm:text-sm">1.1 - SATICI</h4>
              <div className="grid sm:grid-cols-2 gap-2 text-slate-600 text-xs bg-white p-3 rounded-xl border border-slate-200">
                <div><strong>Ünvanı:</strong> Happinio E-Ticaret ve Hediye Atölyesi</div>
                <div><strong>Adresi:</strong> Odunpazarı, Eskişehir / Türkiye</div>
                <div><strong>Telefon:</strong> 0 850 840 60 49</div>
                <div><strong>E-mail:</strong> iletisim@happinio.com</div>
                <div className="sm:col-span-2"><strong>İnternet Sitesi:</strong> www.happinio.com</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 text-xs sm:text-sm">1.2 - TÜKETİCİ (ALICI)</h4>
              <p className="text-xs text-slate-600">
                Happinio (www.happinio.com) üzerinden elektronik ortamda sipariş oluşturan, kişisel veya teslimat adres bilgileri sipariş özetinde yer alan gerçek veya tüzel kişidir.
              </p>
            </div>
          </div>

          {/* MADDE 2 */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base font-serif text-pink-600">
              MADDE 2 - KONU
            </h3>
            <p className="text-slate-600 leading-relaxed">
              İşbu sözleşmenin konusu, TÜKETİCİ’nin SATICI’ya ait “www.happinio.com” internet sitesinden elektronik ortamda siparişini yaptığı aşağıda nitelikleri ve satış fiyatı belirtilen ürünün satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicilerin Korunması Hakkında Kanun ve Mesafeli Sözleşmeleri Uygulama Esas ve Usulleri Hakkında Yönetmelik hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.
            </p>
          </div>

          {/* MADDE 3 */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base font-serif text-pink-600">
              MADDE 3 - SÖZLEŞME KONUSU ÜRÜN
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Ürünlerin cinsi ve türü, miktarı, marka/modeli, rengi, satış bedeli sipariş özetinde ve fatura detaylarında belirtildiği gibidir.
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-1 pl-1 text-xs">
              <li><strong>Ödeme Şekli:</strong> Kredi Kartı / Banka Kartı / iyzico Güvenli Ödeme Altyapısı</li>
              <li><strong>Fatura Adresi:</strong> TÜKETİCİ tarafından sipariş formunda beyan edilen adres</li>
              <li><strong>Teslim Edilecek Kişi:</strong> TÜKETİCİ veya belirlediği Alıcı kişi</li>
              <li><strong>Teslimat Adresi:</strong> Sipariş aşamasında seçilen alıcı adresi</li>
            </ul>
          </div>

          {/* MADDE 4 */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base font-serif text-pink-600">
              MADDE 4 - GENEL HÜKÜMLER
            </h3>
            <div className="space-y-2 text-slate-600 leading-relaxed text-xs sm:text-sm">
              <p>
                <strong>4.1-</strong> TÜKETİCİ, SATICI internet sitesinde sözleşme konusu ürünün/lerin temel nitelikleri, satış fiyatı ve ödeme şekli ile teslimata ilişkin ön bilgileri okuyup bilgi sahibi olduğunu ve elektronik ortamda gerekli teyidi verdiğini beyan eder.
              </p>
              <p>
                <strong>4.2-</strong> Sözleşme konusu maddi ürün, yasal 30 günlük süreyi aşmamak koşulu ile her bir ürün için TÜKETİCİ’nin yerleşim yerinin uzaklığına bağlı olarak internet sitesinde ön bilgiler içinde açıklanan süre içinde TÜKETİCİ veya gösterdiği adresteki kişi/kuruluşa teslim edilir.
              </p>
              <p>
                <strong>4.3-</strong> Sözleşme konusu sanal/yazılımsal/dijital ürün, yasal 30 günlük süreyi aşmamak koşulu ile her bir ürün için elektronik olarak SATICI internet sitesinde TÜKETİCİ adına açılmış olan üyelik altında indirilebilir olarak veya TÜKETİCİ‘nin kayıtlı e-posta adresinde belirtilen link aracılığı indirilebilir olarak teslim edilir. Bu ürün tipi için fiziksel gönderim sağlanmaz.
              </p>
              <p>
                <strong>4.4-</strong> SATICI, sözleşme konusu maddi ürünün sağlam, eksiksiz, siparişte belirtilen niteliklere uygun ve varsa garanti belgeleri ve kullanım kılavuzu/ları ile teslim edilmesinden sorumludur.
              </p>
              <p>
                <strong>4.5-</strong> SATICI, sözleşme konusu sanal/dijital ürünün siparişte belirtilen niteliklere uygun, varsa kullanım kılavuzu/ları ile teslim edilmesinden sorumludur.
              </p>
              <p>
                <strong>4.6-</strong> Sözleşme konusu ürünün teslimatı için işbu sözleşmenin imzalı nüshasının SATICI ‘ya ulaştırılmış olması veya TÜKETİCİ tarafından SATICI internet sitesi üzerinden elektronik olarak veya TÜKETİCİ ‘nin kayıtlı e-posta adresine gönderilen onay e-postasına istinaden elektronik olarak TÜKETİCİ tarafından onay alınması ve bedelinin TÜKETİCİ’nin tercih ettiği ödeme şekli ile ödenmiş olması şarttır. Herhangi bir nedenle ürün bedeli ödenmez veya banka kayıtlarında iptal edilir ise, SATICI ürünün teslimi yükümlülüğünden kurtulmuş kabul edilir.
              </p>
              <p>
                <strong>4.7-</strong> Ürünün tesliminden sonra TÜKETİCİ ‘ye ait kredi kartının TÜKETİCİ’nin kusurundan kaynaklanmayan bir şekilde yetkisiz kişilerce haksız veya hukuka aykırı olarak kullanılması nedeni ile ilgili banka veya finans kuruluşunun ürün bedelini SATICI ‘ya ödememesi halinde, TÜKETİCİ’nin kendisine teslim edilmiş olması kaydıyla maddi ürünün 3 gün içinde SATICI‘ya iade etmesi zorunludur. Ürün, sanal/yazılımsal ise SATICI aktivasyonunu derhal iptal etme hakkına sahiptir. Bu takdirde maddi ürünler için nakliye giderleri TÜKETİCİ’ye aittir.
              </p>
              <p>
                <strong>4.8-</strong> SATICI mücbir sebepler veya maddi ürünler için nakliyeyi engelleyen hava muhalefeti, ulaşımın kesilmesi gibi olağanüstü durumlar nedeni ile sözleşme konusu ürünü süresi içinde teslim edemez ise, durumu TÜKETİCİ’ye bildirmekle yükümlüdür. Bu takdirde TÜKETİCİ siparişin iptal edilmesini, sözleşme konusu ürünün varsa emsali ile değiştirilmesini ve/veya teslimat süresinin engelleyici durumun ortadan kalkmasına kadar ertelenmesi haklarından birini kullanabilir. TÜKETİCİ’nin siparişi iptal etmesi halinde ödediği tutar 15 gün içinde kendisine nakten ve defaten ödenir.
              </p>
              <p>
                <strong>4.9-</strong> Garanti belgesi ile satılan ürünlerden olan veya olmayan ürünlerin arızalı veya bozuk olanlar, garanti şartları içinde gerekli onarımın yapılması için SATICI ‘ya gönderilebilir, bu takdirde kargo giderleri SATICI tarafından karşılanacaktır.
              </p>
              <p>
                <strong>4.10-</strong> İşbu sözleşme, TÜKETİCİ tarafından elektronik ortamda onaylanmasından sonra geçerlilik kazanır.
              </p>
              <p>
                <strong>4.11-</strong> 18 yaşından küçük kişiler SATICI’dan alışveriş yapamaz.
              </p>
              <p>
                <strong>4.12-</strong> Dizgi ve sistem hatalarından meydana gelen fiyat yanlışlıklarından SATICI sorumlu değildir.
              </p>
              <p>
                <strong>4.13-</strong> SATICI, internet sitesinden satışını yaptığı tüm ürünlerin içeriğini, kapsamını ve özelliklerini değiştirme ve iptal etme hakkına sahiptir.
              </p>
              <p>
                <strong>4.14-</strong> Siparişin gerçekleşmesi durumunda ALICI işbu sözleşmenin tüm koşullarını kabul etmiş sayılır.
              </p>
            </div>
          </div>

          {/* MADDE 5 */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base font-serif text-pink-600">
              MADDE 5 - CAYMA HAKKI
            </h3>
            <p className="text-slate-600 leading-relaxed">
              TÜKETİCİ, sözleşme konusu ürünün/lerin kendisine veya gösterdiği adresteki kişi/kuruluşa tesliminden itibaren maddi ürünler için 14 gün içinde işbu sözleşmesinin 6. Maddesinde belirtilen kurallar dahilinde cayma hakkına sahiptir. Cayma hakkının kullanılması için bu süre içinde SATICI ‘ya faks, e-posta veya telefon ile bildirimde bulunulması ve ürünün 6. madde hükümleri çerçevesinde kullanılmamış olması şarttır. Bu hakkın kullanılması halinde, 3. kişiye veya TÜKETİCİ’ye teslim edilen maddi ürünün SATICI ‘ya gönderildiğine ilişkin kargo teslim tutanağı örneği ile fatura aslının iadesi zorunludur. Bu belgelerin ulaşmasını takip eden maddi ürünler için 15 gün içinde ürün bedeli TÜKETİCİ’ye iade edilir. Cayma hakkı nedeni ile iade edilen maddi ürünün kargo bedeli TÜKETİCİ tarafından karşılanır. Fatura aslı ibraz edilmeden iade işlemi gerçekleştirilmez.
            </p>
          </div>

          {/* MADDE 6 */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base font-serif text-pink-600">
              MADDE 6 - CAYMA HAKKI KULLANILAMAYACAK ÜRÜNLER
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Niteliği itibarıyla iade edilemeyecek ürünler, kişiselleştirilmiş hediye kutuları ve isme özel hazırlanan kartlar/ürünler, tek kullanımlık ürünler, kopyalanabilir yazılım ve dijital içerikler, sarf malzemeleri, hızlı bozulan veya son kullanım tarihi geçen ürünler ve hizmet için cayma hakkı kullanılamaz.
            </p>
          </div>

          {/* MADDE 7 */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base font-serif text-pink-600">
              MADDE 7 - YETKİLİ MAHKEME
            </h3>
            <p className="text-slate-600 leading-relaxed">
              İşbu sözleşmenin uygulanmasında, Ticaret Bakanlığınca ilan edilen değere kadar Tüketici Hakem Heyetleri ile TÜKETİCİ’nin veya SATICI’nın yerleşim yerindeki Tüketici Mahkemeleri yetkilidir.
            </p>
            <div className="pt-2 flex flex-wrap justify-between items-center text-xs font-bold text-slate-800 border-t border-slate-200 mt-2">
              <div>SATICI: Happinio E-Ticaret ve Hediye Atölyesi</div>
              <div>TÜKETİCİ: Alıcı</div>
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
